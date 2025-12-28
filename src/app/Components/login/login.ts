import { Component } from '@angular/core';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  login() {
    console.log('🔐 Login function called!');
    console.log('📧 Login values:', { email: this.email, password: this.password });

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

