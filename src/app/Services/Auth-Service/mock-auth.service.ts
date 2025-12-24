import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { Loginrequest } from '../../Models/loginrequest';
import { User } from '../../Models/user';
import { Registerrequest } from '../../Models/registerrequest';
import { UserRole } from '../../Models/user-role';

/**
 * Mock Authentication Service for Frontend Testing
 * This service simulates backend responses with static test data
 * Use this to test the frontend without backend dependency
 */
@Injectable({
    providedIn: 'root',
})
export class MockAuthService {
    // Test users database
    private testUsers: User[] = [
        {
            id: '1',
            fullName: 'Test Owner',
            phoneNumber: '1234567890',
            whatsappNumber: '1234567890',
            role: UserRole.Owner,
            isVerified: true,
            token: 'mock-token-owner-123'
        },
        {
            id: '2',
            fullName: 'Test Agent',
            phoneNumber: '0987654321',
            whatsappNumber: '0987654321',
            role: UserRole.Agent,
            isVerified: true,
            token: 'mock-token-agent-456'
        },
        {
            id: '3',
            fullName: 'Test Admin',
            phoneNumber: '5555555555',
            whatsappNumber: '5555555555',
            role: UserRole.Admin,
            isVerified: true,
            token: 'mock-token-admin-789'
        }
    ];

    // Test credentials (email -> password mapping)
    private testCredentials = new Map<string, string>([
        ['test@homey.com', 'password123'],
        ['owner@homey.com', 'password123'],
        ['agent@homey.com', 'password123'],
        ['admin@homey.com', 'password123']
    ]);

    // Email to user mapping
    private emailToUser = new Map<string, User>([
        ['test@homey.com', this.testUsers[0]],
        ['owner@homey.com', this.testUsers[0]],
        ['agent@homey.com', this.testUsers[1]],
        ['admin@homey.com', this.testUsers[2]]
    ]);

    // Registered emails (to simulate duplicate email error)
    private registeredEmails = new Set<string>([
        'test@homey.com',
        'owner@homey.com',
        'agent@homey.com',
        'admin@homey.com'
    ]);

    constructor() {
        console.log('🧪 MockAuthService initialized - Using test data');
        console.log('📧 Test credentials:', Array.from(this.testCredentials.entries()));
    }

    /**
     * Mock login - simulates backend authentication
     */
    login(data: Loginrequest): Observable<User> {
        console.log('🧪 MockAuthService.login called with:', data);

        // Simulate network delay
        return of(null).pipe(
            delay(500),
            // Then process the login
            switchMap(() => {
                const password = this.testCredentials.get(data.email);

                if (!password) {
                    console.error('❌ Email not found:', data.email);
                    return throwError(() => ({
                        error: { message: 'Invalid email or password' },
                        status: 401
                    }));
                }

                if (password !== data.password) {
                    console.error('❌ Invalid password for:', data.email);
                    return throwError(() => ({
                        error: { message: 'Invalid email or password' },
                        status: 401
                    }));
                }

                const user = this.emailToUser.get(data.email)!;
                console.log('✅ Login successful:', user);
                return of(user);
            })
        );
    }

    /**
     * Mock register - simulates user registration
     */
    register(data: Registerrequest): Observable<User> {
        console.log('🧪 MockAuthService.register called with:', data);

        // Simulate network delay
        return of(null).pipe(
            delay(500),
            switchMap(() => {
                // Check if email already exists
                if (this.registeredEmails.has(data.email)) {
                    console.error('❌ Email already registered:', data.email);
                    return throwError(() => ({
                        error: { message: 'Email already exists' },
                        status: 400
                    }));
                }

                // Check password match
                if (data.password !== data.confirmPassword) {
                    console.error('❌ Passwords do not match');
                    return throwError(() => ({
                        error: { message: 'Passwords do not match' },
                        status: 400
                    }));
                }

                // Create new user
                const newUser: User = {
                    id: `mock-${Date.now()}`,
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    whatsappNumber: data.whatsappNumber,
                    role: data.role,
                    isVerified: false,
                    token: `mock-token-${Date.now()}`
                };

                // Add to registered emails
                this.registeredEmails.add(data.email);
                this.emailToUser.set(data.email, newUser);
                this.testCredentials.set(data.email, data.password);

                console.log('✅ Registration successful:', newUser);
                return of(newUser);
            })
        );
    }

    /**
     * Mock getCurrentUser - returns user from token
     */
    getCurrentUser(): Observable<User> {
        console.log('🧪 MockAuthService.getCurrentUser called');

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('❌ No token found');
            return throwError(() => ({
                error: { message: 'Not authenticated' },
                status: 401
            }));
        }

        // Find user by token
        const user = this.testUsers.find(u => u.token === token);
        if (!user) {
            console.error('❌ Invalid token');
            return throwError(() => ({
                error: { message: 'Invalid token' },
                status: 401
            }));
        }

        console.log('✅ Current user:', user);
        return of(user).pipe(delay(300));
    }

    /**
     * Store authentication data after successful login/register
     */
    storeAuthData(user: User) {
        if (user.token) {
            localStorage.setItem('token', user.token);
        }
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ Mock Auth data stored:', { token: user.token, user: user.fullName });
    }

    /**
     * Get stored user data from localStorage
     */
    getStoredUser(): User | null {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                return JSON.parse(userJson) as User;
            } catch (e) {
                console.error('Error parsing stored user:', e);
                return null;
            }
        }
        return null;
    }

    get token() {
        return localStorage.getItem('token');
    }

    logout() {
        console.log('🧪 MockAuthService.logout called');
        localStorage.clear();
    }

    isLoggedIn() {
        return !!this.token;
    }
}

// Import switchMap for the pipe operations
import { switchMap } from 'rxjs/operators';
