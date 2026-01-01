import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../Services/Auth-Service/auth-service';

/**
 * Guest Guard - Prevents logged-in users from accessing login/register pages
 * Redirects logged-in users to home page
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is logged in, redirect to home
  if (authService.isLoggedIn()) {
    console.log('🚫 Guest Guard: User is logged in, redirecting to home');
    router.navigate(['/']);
    return false;
  }

  // Allow access if not logged in
  return true;
};
