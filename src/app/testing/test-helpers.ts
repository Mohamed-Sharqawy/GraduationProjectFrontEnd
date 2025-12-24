import { Provider } from '@angular/core';
import { AuthService } from '../Services/Auth-Service/auth-service';
import { MockAuthService } from '../Services/Auth-Service/mock-auth.service';

/**
 * Test Helper Configuration
 * Use this to switch between real and mock authentication services
 */

// Set to true to use mock service for testing
export const USE_MOCK_AUTH = true;

/**
 * Get the auth service provider based on configuration
 */
export function getAuthServiceProvider(): Provider {
    if (USE_MOCK_AUTH) {
        console.log('🧪 Using MockAuthService for testing');
        return {
            provide: AuthService,
            useClass: MockAuthService
        };
    } else {
        console.log('🌐 Using real AuthService');
        return AuthService;
    }
}

/**
 * Test user credentials for quick reference
 */
export const TEST_CREDENTIALS = {
    owner: {
        email: 'test@homey.com',
        password: 'password123',
        role: 'Owner'
    },
    agent: {
        email: 'agent@homey.com',
        password: 'agent123',
        role: 'Agent'
    },
    admin: {
        email: 'admin@homey.com',
        password: 'admin123',
        role: 'Admin'
    }
};

/**
 * Helper to clear all auth data (for testing logout)
 */
export function clearAuthData() {
    localStorage.clear();
    console.log('🧹 Auth data cleared');
}

/**
 * Helper to check current auth state
 */
export function getAuthState() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    return {
        isAuthenticated: !!token,
        token,
        user: userJson ? JSON.parse(userJson) : null
    };
}

/**
 * Helper to log current auth state to console
 */
export function logAuthState() {
    const state = getAuthState();
    console.log('🔍 Current Auth State:', state);
    return state;
}
