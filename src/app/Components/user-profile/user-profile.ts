import { Component, OnInit, ChangeDetectorRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../Models/user-role';
import { SubscriptionService } from '../../Services/Subscription-Service/subscription.service';
import { SavedPropertyService } from '../../Services/SavedProperty-Service/saved-property.service';
import { PackageDto, SubscriptionStatusDto } from '../../Models/Subscription/subscription.models';
import { SavedPropertyDto } from '../../Models/SavedProperty/saved-property.models';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './user-profile.html',
    styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
    activeTab: 'published' | 'subscription' | 'saved' | 'personal-info' = 'published';



    // Personal Info Form Data
    formData = {
        fullName: '',
        email: '',
        phone: '',
        whatsapp: ''
    };

    // Edit Mode State
    isEditingProfile = false;

    startEditing() {
        this.isEditingProfile = true;
    }

    cancelEditing() {
        this.isEditingProfile = false;
        // Re-reset form data to current user to discard changes
        const user = this.authService.currentUser();
        if (user) {
            const u = user as any;
            this.formData = {
                fullName: user.fullName || u.FullName || '',
                email: user.email || u.Email || '',
                phone: user.phoneNumber || u.PhoneNumber || '',
                whatsapp: user.whatsappNumber || u.WhatsappNumber || u.WhatsAppNumber || ''
            };
        }
    }

    // Packages from API
    packages: PackageDto[] = [];
    isLoadingPackages = false;

    // Subscription Status from API
    subscriptionStatus: SubscriptionStatusDto | null = null;
    isLoadingSubscription = false;

    // Saved Properties from API
    savedProperties: SavedPropertyDto[] = [];
    isLoadingSaved = false;

    // PayPal payment state
    isProcessingPayment = false;
    selectedPackageId: number | null = null;

    public authService = inject(AuthService);
    private subscriptionService = inject(SubscriptionService);
    private savedPropertyService = inject(SavedPropertyService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private toastr = inject(ToastrService);

    constructor() {
        // Initialize form data with current user using effect to stay in sync
        effect(() => {
            const user = this.authService.currentUser();
            console.log('👤 UserProfile: Current user changed:', user);
            if (user) {
                // Use 'any' cast to access potential PascalCase properties from backend
                const u = user as any;
                this.formData = {
                    fullName: user.fullName || u.FullName || '',
                    email: user.email || u.Email || '',
                    phone: user.phoneNumber || u.PhoneNumber || '',
                    whatsapp: user.whatsappNumber || u.WhatsappNumber || u.WhatsAppNumber || ''
                };
            }
        });
    }

    ngOnInit() {
        // Refresh user data from server to ensure we have the latest info (including potentially missing fields)
        if (this.authService.isLoggedIn()) {
            this.authService.getCurrentUser().subscribe({
                next: (user) => {
                    console.log('🔄 UserProfile: Refreshed user data from server:', user);
                    this.authService.storeAuthData(user);
                },
                error: (err) => console.error('Failed to refresh user data:', err)
            });
        }

        // Check for tab query param
        this.route.queryParams.subscribe(params => {
            if (params['tab']) {
                this.setActiveTab(params['tab'] as any);
            }
        });

        // Check for PayPal callback
        this.route.queryParams.subscribe(params => {
            if (params['token'] && params['PayerID']) {
                // PayPal returned with payment approval
                this.handlePayPalCallback(params['token'], params['PayerID']);
            }
        });

        // Load packages on init
        this.loadPackages();
        this.loadSubscriptionStatus();
    }

    setActiveTab(tab: 'published' | 'subscription' | 'saved' | 'personal-info') {
        this.activeTab = tab;

        // Load data when switching tabs
        if (tab === 'saved') {
            this.loadSavedProperties();
        } else if (tab === 'subscription') {
            this.loadPackages();
            this.loadSubscriptionStatus();
        }
    }

    /**
     * Load available packages from API
     */
    loadPackages() {
        this.isLoadingPackages = true;
        this.subscriptionService.getPackages().subscribe({
            next: (packages) => {
                console.log('API Response Packages:', packages);
                if (packages && packages.length > 0) {
                    console.log('First package sample:', packages[0]);
                } else {
                    console.warn('API returned empty packages array');
                }
                this.packages = packages;
                this.isLoadingPackages = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to load packages:', error);
                this.isLoadingPackages = false;
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Load subscription status from API
     */
    loadSubscriptionStatus() {
        if (!this.authService.isLoggedIn()) return;

        this.isLoadingSubscription = true;
        this.subscriptionService.getSubscriptionStatus().subscribe({
            next: (status) => {
                this.subscriptionStatus = status;
                this.isLoadingSubscription = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to load subscription status:', error);
                this.isLoadingSubscription = false;
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Load saved properties from API
     */
    loadSavedProperties() {
        if (!this.authService.isLoggedIn()) return;

        this.isLoadingSaved = true;
        this.savedPropertyService.getMySavedProperties().subscribe({
            next: (properties) => {
                this.savedProperties = properties;
                this.isLoadingSaved = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to load saved properties:', error);
                this.isLoadingSaved = false;
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Subscribe to a package via PayPal
     */
    subscribe(pkg: PackageDto) {
        if (this.isProcessingPayment) return;

        this.isProcessingPayment = true;
        this.selectedPackageId = pkg.id;

        this.subscriptionService.createPayPalOrder(pkg.id).subscribe({
            next: (response) => {
                // Store package ID for capture callback
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('pendingPackageId', pkg.id.toString());
                }
                // Redirect to PayPal
                window.location.href = response.approvalUrl;
            },
            error: (error) => {
                console.error('Failed to create PayPal order:', error);

                let errorMessage = 'Failed to start payment. Please try again.';
                if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                }

                if (errorMessage.includes('توثيق') || errorMessage.includes('verify')) {
                    this.toastr.warning(errorMessage, 'Verification Required');
                } else {
                    this.toastr.error(errorMessage, 'Payment Error');
                }

                this.isProcessingPayment = false;
                this.selectedPackageId = null;
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Handle PayPal callback after user approval
     */
    handlePayPalCallback(orderId: string, payerId: string) {
        const packageIdStr = typeof localStorage !== 'undefined' ? localStorage.getItem('pendingPackageId') : null;
        if (!packageIdStr) {
            console.error('No pending package ID found');
            return;
        }

        const packageId = parseInt(packageIdStr, 10);
        this.isProcessingPayment = true;

        this.subscriptionService.capturePayment({
            packageId,
            payPalOrderId: orderId,
            payPalPayerId: payerId
        }).subscribe({
            next: (response) => {
                if (response.success) {
                    // Clear pending package ID
                    if (typeof localStorage !== 'undefined') {
                        localStorage.removeItem('pendingPackageId');
                    }

                    // Update user role to Agent
                    const currentUser = this.authService.currentUser();
                    if (currentUser) {
                        const updatedUser = { ...currentUser, role: UserRole.Agent };
                        this.authService.currentUser.set(updatedUser);
                        if (typeof localStorage !== 'undefined') {
                            localStorage.setItem('user', JSON.stringify(updatedUser));
                        }
                    }

                    // Reload subscription status
                    this.loadSubscriptionStatus();
                    this.toastr.success('You now have an active subscription!', '🎉 Payment Successful');

                    // Redirect to dashboard after a short delay
                    setTimeout(() => {
                        this.router.navigate(['/user-dashboard']);
                    }, 1500);
                } else {
                    this.toastr.error('Payment failed: ' + response.message, 'Payment Error');
                }
                this.isProcessingPayment = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to capture payment:', error);
                this.isProcessingPayment = false;
                this.toastr.error('Failed to complete payment. Please contact support.', 'Payment Error');
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Unsave a property from saved list
     */
    unsaveProperty(propertyId: number) {
        this.savedPropertyService.unsaveProperty(propertyId).subscribe({
            next: () => {
                this.savedProperties = this.savedProperties.filter(sp => sp.property.id !== propertyId);
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to unsave property:', error);
            }
        });
    }

    /**
     * Check if user has active subscription
     */
    get hasActiveSubscription(): boolean {
        return this.subscriptionStatus?.hasActiveSubscription ?? false;
    }

    /**
     * Get remaining ads display data
     */
    get remainingAdsDisplay() {
        if (!this.subscriptionStatus || !this.subscriptionStatus.hasActiveSubscription) {
            return { standard: 0, featured: 0, remaining: 0 };
        }
        return {
            standard: this.subscriptionStatus.propertiesRemaining,
            featured: this.subscriptionStatus.featuredRemaining,
            remaining: this.subscriptionStatus.daysRemaining
        };
    }

    selectedFile: File | null = null;
    filePreviewUrl: string | null = null; // For local preview before upload

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                this.filePreviewUrl = reader.result as string;
                this.cdr.detectChanges(); // Update view with new image
            };
            reader.readAsDataURL(file);
        }
    }

    saveProfile() {
        const formData = new FormData();

        // Append text fields
        // The API likely expects key 'FullName' etc. matching the DTO properties.
        // Based on the user's screenshot: FullName, PhoneNumber, WhatsAppNumber, ProfileImage
        formData.append('FullName', this.formData.fullName);
        if (this.formData.phone) formData.append('PhoneNumber', this.formData.phone);
        if (this.formData.whatsapp) formData.append('WhatsAppNumber', this.formData.whatsapp); // Double check if it is WhatsAppNumber or WhatsappNumber. Screenshot says WhatsAppNumber.

        // Append file if selected
        if (this.selectedFile) {
            formData.append('ProfileImage', this.selectedFile);
        }

        this.authService.updateAgentProfile(formData).subscribe({
            next: () => {
                this.toastr.success('Profile updated successfully!', 'Success');
                // Reset selected file after success since it should be part of user profile now
                this.selectedFile = null;
                this.filePreviewUrl = null;
                this.isEditingProfile = false; // Turn off edit mode
            },
            error: (error) => {
                console.error('Failed to update profile:', error);
                this.toastr.error('Failed to update profile information.', 'Error');
            }
        });
    }

    /**
     * Handle "List a Property" button click
     * Checks subscription status and redirects accordingly
     */
    handleListProperty() {
        if (!this.hasActiveSubscription) {
            // No active subscription - redirect to subscription tab
            this.setActiveTab('subscription');
            this.toastr.warning('You need an active subscription to list properties. Please subscribe to a plan first.', 'Subscription Required');
        } else {
            // Has subscription - redirect to dashboard/property creation
            window.location.href = '/user-dashboard';
        }
    }


}

