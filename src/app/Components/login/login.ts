import { Component, inject } from '@angular/core';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  validationErrors: any = {}; // For inline validation

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  validateLogin(): boolean {
    this.validationErrors = {};

    if (!this.email || this.email.trim() === '') {
      this.validationErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.validationErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!this.password || this.password.trim() === '') {
      this.validationErrors.password = 'كلمة المرور مطلوبة';
    } else if (this.password.length < 6) {
      this.validationErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  login() {
    console.log('🔐 Login function called!');
    console.log('📧 Login values:', { email: this.email, password: this.password });

    // Validate before submission
    if (!this.validateLogin()) {
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('✅ Login successful:', response);

        // Store authentication data - handled in service
        // this.authService.storeAuthData(response);

        // Show success message
        this.toastr.success(`Welcome back, ${response.fullName}!`, 'Login Successful');

        // Navigate to home page
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Login failed:', error);
        this.toastr.error(error.error?.message || error.message || 'Invalid credentials', 'Login Failed');
      }
    });
  }
}

