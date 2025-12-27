import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../Models/user-role';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './user-profile.html',
    styleUrl: './user-profile.css'
})
export class UserProfile {
    activeTab: 'published' | 'subscription' | 'saved' | 'personal-info' = 'published';

    // Personal Info Form Data
    formData = {
        fullName: '',
        email: '',
        phone: '',
        whatsapp: ''
    };

    // Static subscription data
    packages = [
        {
            name: 'Bronze',
            type: 'bronze',
            price: 'Free',
            features: ['5 Standard Ads', '0 Featured Ads', '0 Premium Ads'],
            quota: { standard: 5, featured: 0, premium: 0 }
        },
        {
            name: 'Silver',
            type: 'silver',
            price: '$29/mo',
            features: ['15 Standard Ads', '5 Featured Ads', '1 Premium Ad'],
            quota: { standard: 15, featured: 5, premium: 1 }
        },
        {
            name: 'Gold',
            type: 'gold',
            price: '$99/mo',
            features: ['Unlimited Standard Ads', '20 Featured Ads', '10 Premium Ads'],
            quota: { standard: 999, featured: 20, premium: 10 }
        }
    ];

    // Mock User Subscription State
    currentSubscription: any = null;

    constructor(public authService: AuthService) {
        // Initialize form data with current user
        const user = this.authService.currentUser();
        if (user) {
            this.formData = {
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phoneNumber || '',
                whatsapp: user.whatsappNumber || ''
            };
        }
    }

    setActiveTab(tab: 'published' | 'subscription' | 'saved' | 'personal-info') {
        this.activeTab = tab;
    }

    subscribe(pkg: any) {
        if (confirm(`Do you want to subscribe to the ${pkg.name} package? (Mock Payment)`)) {
            // Mock successful payment
            this.currentSubscription = {
                package: pkg,
                remainingAds: { ...pkg.quota },
                startDate: new Date()
            };

            // Mock upgrading the user to Agent so they can access the dashboard
            const currentUser = this.authService.currentUser();
            if (currentUser) {
                const updatedUser = { ...currentUser, role: UserRole.Agent };
                this.authService.currentUser.set(updatedUser);

                // Also update local storage for persistence if needed
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            }

            alert('Subscription Successful! You have been upgraded to Agent status and can now access the dashboard.');
        }
    }

    get remainingAdsDisplay() {
        if (!this.currentSubscription) return null;
        return this.currentSubscription.remainingAds;
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const imageUrl = e.target.result;

                // Update user state
                const currentUser = this.authService.currentUser();
                if (currentUser) {
                    const updatedUser = { ...currentUser, profileImageUrl: imageUrl };
                    this.authService.currentUser.set(updatedUser);

                    // Persist to local storage
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    }
    saveProfile() {
        const currentUser = this.authService.currentUser();
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                fullName: this.formData.fullName,
                email: this.formData.email,
                phoneNumber: this.formData.phone,
                whatsappNumber: this.formData.whatsapp
            };

            this.authService.currentUser.set(updatedUser);

            // Persist to local storage
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            alert('Personal information updated successfully!');
        }
    }
}
