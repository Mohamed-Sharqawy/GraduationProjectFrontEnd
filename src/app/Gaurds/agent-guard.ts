import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/Auth-Service/auth-service';
import { inject } from '@angular/core';
import { UserRole } from '../Models/user-role';

export const agentGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    // Check if logged in AND has Agent role (2 based on enum)
    if (authService.isLoggedIn() && user?.role === UserRole.Agent) {
        return true;
    }

    // If logged in but not agent, maybe redirect to home or user-profile?
    // For now, redirect to home if logged in, or login if not.
    if (authService.isLoggedIn()) {
        router.navigate(['/home']);
    } else {
        router.navigate(['/login']);
    }

    return false;
};
