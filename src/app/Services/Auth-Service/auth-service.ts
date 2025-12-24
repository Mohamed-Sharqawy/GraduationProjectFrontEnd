import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) { }

  login(data: Loginrequest) {
    return this.http.post<User>(this.apiUrl + API_EndPoints.login, data);
  }

  register(data: Registerrequest) {
    return this.http.post<User>(this.apiUrl + API_EndPoints.register, data);
  }

  getCurrentUser() {
    return this.http.get<User>(this.apiUrl + API_EndPoints.getCurrentUser);
  }

  /**
   * Store authentication data after successful login/register
   */
  storeAuthData(user: User) {
    if (user.token) {
      localStorage.setItem('token', user.token);
    }
    localStorage.setItem('user', JSON.stringify(user));
    console.log('✅ Auth data stored:', { token: user.token, user: user.fullName });
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
    console.log('🚪 Logging out...');
    localStorage.clear();
  }

  isLoggedIn() {
    return !!this.token;
  }

}
