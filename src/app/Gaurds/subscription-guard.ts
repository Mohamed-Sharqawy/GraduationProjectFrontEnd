import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SubscriptionService } from '../Services/Subscription-Service/subscription.service';
import { AuthService } from '../Services/Auth-Service/auth-service';

/**
 * Guard that checks if user has an active subscription
 * Redirects to user profile subscription tab if not subscribed
 */
export const subscriptionGuard: CanActivateFn = (route, state) => {
    const subscriptionService = inject(SubscriptionService);
    const authService = inject(AuthService);
    const router = inject(Router);

    // First check if user is logged in
    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    // Check subscription status
    return subscriptionService.getSubscriptionStatus().pipe(
        map(status => {
            if (status.hasActiveSubscription) {
                return true;
            } else {
                // Redirect to user profile with subscription tab
                router.navigate(['/user-profile'], {
                    queryParams: { tab: 'subscription' }
                });
                return false;
            }
        }),
        catchError(error => {
            console.error('Error checking subscription status:', error);
            // On error, redirect to subscription page
            router.navigate(['/user-profile'], {
                queryParams: { tab: 'subscription' }
            });
            return of(false);
        })
    );
};
