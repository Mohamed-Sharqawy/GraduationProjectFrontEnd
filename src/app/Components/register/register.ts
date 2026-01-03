import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../Models/user-role';
import { Registerrequest } from '../../Models/registerrequest';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  UserRole = UserRole; // Expose enum to template
  fullName = '';
  phoneNumber = '';
  whatsAppNumber?: string;
  password = '';
  confirmPassword = '';
  email = '';
  role: UserRole = UserRole.Owner; // Use UserRole enum type instead of string
  validationErrors: any = {}; // For inline validation

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  validateRegister(): boolean {
    this.validationErrors = {};

    // Full Name validation
    if (!this.fullName || this.fullName.trim() === '') {
      this.validationErrors.fullName = this.translate.instant('AUTH_VALIDATION.NAME_REQUIRED');
    } else if (this.fullName.trim().length < 3) {
      this.validationErrors.fullName = this.translate.instant('AUTH_VALIDATION.NAME_MIN_LENGTH');
    }

    // Email validation
    if (!this.email || this.email.trim() === '') {
      this.validationErrors.email = this.translate.instant('AUTH_VALIDATION.EMAIL_REQUIRED');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.validationErrors.email = this.translate.instant('AUTH_VALIDATION.EMAIL_INVALID');
    }

    // Phone validation
    if (!this.phoneNumber || this.phoneNumber.trim() === '') {
      this.validationErrors.phoneNumber = this.translate.instant('AUTH_VALIDATION.PHONE_REQUIRED');
    } else if (!/^[0-9]{11}$/.test(this.phoneNumber.replace(/[\s-]/g, ''))) {
      this.validationErrors.phoneNumber = this.translate.instant('AUTH_VALIDATION.PHONE_INVALID');
    }

    // Password validation
    if (!this.password || this.password.trim() === '') {
      this.validationErrors.password = this.translate.instant('AUTH_VALIDATION.PASSWORD_REQUIRED');
    } else if (this.password.length < 6) {
      this.validationErrors.password = this.translate.instant('AUTH_VALIDATION.PASSWORD_MIN_LENGTH');
    }

    // Confirm Password validation
    if (!this.confirmPassword || this.confirmPassword.trim() === '') {
      this.validationErrors.confirmPassword = this.translate.instant('AUTH_VALIDATION.CONFIRM_PASSWORD_REQUIRED');
    } else if (this.password !== this.confirmPassword) {
      this.validationErrors.confirmPassword = this.translate.instant('AUTH_VALIDATION.PASSWORDS_MISMATCH');
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  register() {
    console.log('📝 Register function called!');
    console.log('📋 Form values:', {
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      whatsAppNumber: this.whatsAppNumber,
      role: this.role,
      password: this.password,
      confirmPassword: this.confirmPassword
    });

    // Validate before submission
    if (!this.validateRegister()) {
      return;
    }

    // Create the registration request with properly typed role
    const payload: Registerrequest = {
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      whatsappNumber: this.whatsAppNumber,
      password: this.password,
      confirmPassword: this.confirmPassword,
      email: this.email,
      role: this.role
    };

    console.log('📤 Sending payload:', payload);

    this.authService.register(payload).subscribe({
      next: (response) => {
        console.log('✅ Registration successful:', response);

        // Store authentication data - handled in service
        // this.authService.storeAuthData(response);

        // Show success message
        this.toastr.success(`Welcome to Homey, ${response.fullName}! Your account has been created.`, 'Registration Successful');

        // Navigate to home page
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Registration failed:', error);
        this.toastr.error(error.error?.message || error.message || 'Unknown error', 'Registration Failed');
      }
    });
  }
}

