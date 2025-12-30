import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { API_EndPoints } from '../../../environments/api.config';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Loginrequest } from '../../Models/loginrequest';
import { User } from '../../Models/user';
import { Registerrequest } from '../../Models/registerrequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + API_EndPoints.account;

  // Create a writable signal for the current user
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    // Initialize user state from local storage on service creation - only in browser
    if (typeof window !== 'undefined') {
      const storedUser = this.getStoredUser();
      if (storedUser) {
        this.currentUser.set(storedUser);
      }
    }
  }

  login(data: Loginrequest) {
    return this.http.post<User>(this.apiUrl + API_EndPoints.login, data).pipe(
      tap(user => this.storeAuthData(user))
    );
  }

  register(data: Registerrequest) {
    return this.http.post<User>(this.apiUrl + API_EndPoints.register, data).pipe(
      tap(user => this.storeAuthData(user))
    );
  }

  getCurrentUser() {
    return this.http.get<User>(this.apiUrl + API_EndPoints.getCurrentUser);
  }

  updateProfile(data: Partial<User>) {
    return this.http.put<User>(this.apiUrl + API_EndPoints.updateProfile, data).pipe(
      tap(updatedUser => {
        // Merge with existing user data to preserve token and other fields
        const currentUser = this.currentUser();
        if (currentUser) {
          const mergedUser = { ...currentUser, ...updatedUser };
          this.storeAuthData(mergedUser);
        }
      })
    );
  }

  uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string }>(this.apiUrl + API_EndPoints.uploadPhoto, formData).pipe(
      tap(response => {
        const currentUser = this.currentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, profileImageUrl: response.imageUrl };
          this.storeAuthData(updatedUser);
        }
      })
    );
  }

  updateAgentProfile(formData: FormData) {
    // using environment.apiUrl + '/Agents' + '/profile' as discussed
    // This assumes environment.apiUrl ends with /api usually, but let's check environment.ts if possible or safe bet
    // Existing code uses environment.apiUrl + API_EndPoints.account
    // API_EndPoints.account is '/Account'
    // So environment.apiUrl is likely 'http://.../api' or 'http://...'
    // I'll reuse the pattern.
    const agentsUrl = environment.apiUrl + API_EndPoints.agents + '/profile';
    return this.http.put(agentsUrl, formData).pipe(
      tap(() => {
        // We need to fetch the updated user data or update the signal locally
        // Fetch current user again to get the updated profileImageUrl
        const existingToken = this.currentUser()?.token;
        this.getCurrentUser().subscribe(user => {
          // Preserve the token since getCurrentUser might not return it
          if (existingToken && !user.token) {
            user.token = existingToken;
          }
          this.storeAuthData(user);
          console.log('✅ Profile updated with image URL:', user.profileImageUrl);
        });
      })
    );
  }

  /**
   * Store authentication data after successful login/register
   */
  storeAuthData(user: User) {
    if (typeof localStorage !== 'undefined') {
      if (user.token) {
        localStorage.setItem('token', user.token);
      }
      localStorage.setItem('user', JSON.stringify(user));
      console.log('✅ Auth data stored:', { token: user.token, user: user.fullName });
    }

    // Update the signal
    this.currentUser.set(user);
  }

  /**
   * Get stored user data from localStorage
   */
  getStoredUser(): User | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }

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

  get token(): string | null {
    // Ensure we're in browser before accessing localStorage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  logout() {
    console.log('🚪 Logging out...');
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    // Clear the signal
    this.currentUser.set(null);
  }

  isLoggedIn() {
    return !!this.token;
  }

}
