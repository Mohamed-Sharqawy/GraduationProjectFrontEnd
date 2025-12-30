import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/Auth-Service/auth-service';
import { inject, PLATFORM_ID } from '@angular/core';
import { UserRole } from '../Models/user-role';
import { isPlatformBrowser } from '@angular/common';

export const agentGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }
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
