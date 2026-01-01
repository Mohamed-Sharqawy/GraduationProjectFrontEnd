import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css'
})
export class ChangePasswordModalComponent {
  @Output() close = new EventEmitter<void>();
  
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  isSubmitting = false;
  
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  
  get passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }
  
  get isValid(): boolean {
    return this.currentPassword.length >= 6 && 
           this.newPassword.length >= 6 && 
           this.passwordsMatch;
  }
  
  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
  
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
  
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  onSubmit() {
    if (!this.isValid || this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message || 'Password changed successfully', 'Success');
        this.close.emit();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to change password';
        this.toastr.error(errorMsg, 'Error');
        this.isSubmitting = false;
      }
    });
  }
  
  onCancel() {
    this.close.emit();
  }
}
