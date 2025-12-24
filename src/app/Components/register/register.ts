import { Component } from '@angular/core';
import { UserRole } from '../../Models/user-role';
import { Registerrequest } from '../../Models/registerrequest';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = '';
  phoneNumber = '';
  whatsAppNumber?: string;
  password = '';
  confirmPassword = '';
  email = '';
  role: UserRole = UserRole.Owner; // Use UserRole enum type instead of string

  constructor(private authService: AuthService, private router: Router) { }

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

    // Validate password match
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Validate required fields
    if (!this.fullName || !this.email || !this.phoneNumber || !this.password) {
      alert('Please fill in all required fields!');
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

        // Store authentication data
        this.authService.storeAuthData(response);

        // Show success message
        alert(`Welcome to Homey, ${response.fullName}! Your account has been created.`);

        // Navigate to home page
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Registration failed:', error);
        alert('Registration failed: ' + (error.error?.message || error.message || 'Unknown error'));
      }
    });
  }
}
