import { Component, OnInit, ChangeDetectorRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../../Models/user-role';
import { SubscriptionService } from '../../Services/Subscription-Service/subscription.service';
import { SavedPropertyService } from '../../Services/SavedProperty-Service/saved-property.service';
import { PackageDto, SubscriptionStatusDto } from '../../Models/Subscription/subscription.models';
import { SavedPropertyDto } from '../../Models/SavedProperty/saved-property.models';
import { ToastrService } from 'ngx-toastr';
import { AgentService } from '../../Services/Agent-Service/agent.service';
import { VerificationFiles } from '../../Models/Verification/verification.models';
import { environment } from '../../../environments/environments';
import { UserDashboard } from '../userdashboard/userdashboard';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, TranslateModule, UserDashboard, ChangePasswordModalComponent],
    templateUrl: './user-profile.html',
    styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
    activeTab: 'my-properties' | 'published' | 'subscription' | 'saved' | 'personal-info' | 'verification' = 'my-properties';

    // Backend base URL for images (remove /api from apiUrl)
    private backendBaseUrl = environment.apiUrl.replace('/api', '');



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
                whatsapp: user.whatsAppNumber || u.WhatsappNumber || u.WhatsAppNumber || ''
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
    private agentService = inject(AgentService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private toastr = inject(ToastrService);
    private translationService = inject(TranslateService);

    // Verification state
    verificationFiles: VerificationFiles = {
        idCardFront: null,
        idCardBack: null,
        selfieWithId: null
    };
    verificationPreviews: { [key: string]: string | null } = {
        idCardFront: null,
        idCardBack: null,
        selfieWithId: null
    };
    isSubmittingVerification = false;

    // Password change modal state
    showChangePasswordModal = false;

    // Inline password change form
    passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;
    isSubmittingPassword = false;

    /**
     * Check if password form is valid
     */
    isPasswordFormValid(): boolean {
        return (
            this.passwordForm.currentPassword.length >= 6 &&
            this.passwordForm.newPassword.length >= 6 &&
            this.passwordForm.confirmPassword.length >= 6 &&
            this.passwordForm.newPassword === this.passwordForm.confirmPassword
        );
    }

    /**
     * Save password changes
     */
    async savePassword() {
        if (!this.isPasswordFormValid()) {
            return;
        }

        this.isSubmittingPassword = true;

        try {
            await this.authService.changePassword(
                this.passwordForm.currentPassword,
                this.passwordForm.newPassword
            ).toPromise();

            this.toastr.success(
                this.translationService.instant('CHANGE_PASSWORD.SUCCESS'),
                this.translationService.instant('COMMON.SUCCESS')
            );

            // Reset form
            this.passwordForm = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
            this.showCurrentPassword = false;
            this.showNewPassword = false;
            this.showConfirmPassword = false;
        } catch (error: any) {
            const errorMessage = error?.error?.message || this.translationService.instant('CHANGE_PASSWORD.ERROR');
            this.toastr.error(errorMessage, this.translationService.instant('COMMON.ERROR'));
        } finally {
            this.isSubmittingPassword = false;
        }
    }

    /**
     * Open change password modal
     */
    openChangePasswordModal() {
        this.showChangePasswordModal = true;
    }

    /**
     * Close change password modal
     */
    closeChangePasswordModal() {
        this.showChangePasswordModal = false;
    }

    constructor() {
        // Initialize form data with current user using effect to stay in sync
        effect(() => {
            const user = this.authService.currentUser();
            console.log('👤 UserProfile: Current user changed:', user);
            if (user) {
                console.log('📋 User data in effect:', JSON.stringify(user, null, 2));
                this.formData = {
                    fullName: user.fullName || '',
                    email: user.email || '',
                    phone: user.phoneNumber || '',
                    whatsapp: user.whatsAppNumber || ''
                };
                console.log('📋 Form data populated:', this.formData);
            }
        });
    }

    /**
     * Get the full profile image URL
     * Handles both local file preview and backend image URLs
     */
    getProfileImageUrl(): string | null {
        // If there's a local file preview, use that
        if (this.filePreviewUrl) {
            return this.filePreviewUrl;
        }

        // Get the profile image URL from user data
        const imageUrl = this.authService.currentUser()?.profileImageUrl;
        if (!imageUrl) {
            return null;
        }

        // If it's already a full URL (starts with http), return as-is
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        // Otherwise, prepend the backend base URL
        return this.backendBaseUrl + imageUrl;
    }

    // Current language
    currentLang: string = 'ar';

    ngOnInit() {
        // Get current language
        this.currentLang = this.translationService.currentLang || this.translationService.defaultLang || 'ar';
        
        // Subscribe to language changes
        this.translationService.onLangChange.subscribe(event => {
            this.currentLang = event.lang;
            this.cdr.detectChanges();
        });

        // Refresh user data from backend to ensure we have the latest profile image URL
        if (this.authService.isLoggedIn()) {
            this.authService.getCurrentUser().subscribe({
                next: (user) => {
                    console.log('📥 Raw user data from API:', JSON.stringify(user, null, 2));
                    // Preserve the token since getCurrentUser might not return it
                    const existingToken = this.authService.currentUser()?.token;
                    if (existingToken && !user.token) {
                        user.token = existingToken;
                    }
                    this.authService.storeAuthData(user);
                    this.cdr.detectChanges();
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

    setActiveTab(tab: 'my-properties' | 'published' | 'subscription' | 'saved' | 'personal-info' | 'verification') {
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
        if (this.formData.email) formData.append('Email', this.formData.email);
        if (this.formData.phone) formData.append('PhoneNumber', this.formData.phone);
        if (this.formData.whatsapp) formData.append('WhatsAppNumber', this.formData.whatsapp);

        // Append file if selected
        if (this.selectedFile) {
            formData.append('ProfileImage', this.selectedFile);
        }

        this.authService.updateAgentProfile(formData).subscribe({
            next: () => {
                this.toastr.success('Profile updated successfully!', 'Success');
                // Reset selected file and preview after success
                this.selectedFile = null;
                this.filePreviewUrl = null;

                // Force refresh of user data to get the updated profile image URL
                // The authService.updateAgentProfile already calls getCurrentUser internally,
                // but we need to wait for it to complete and update our local form data
                setTimeout(() => {
                    const updatedUser = this.authService.currentUser();
                    if (updatedUser) {
                        this.formData = {
                            fullName: updatedUser.fullName || '',
                            email: updatedUser.email || '',
                            phone: updatedUser.phoneNumber || '',
                            whatsapp: updatedUser.whatsAppNumber || ''
                        };
                        this.cdr.detectChanges();
                    }
                }, 500);
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

    /**
     * Handle verification file selection
     */
    onVerificationFileSelected(event: any, fileType: 'idCardFront' | 'idCardBack' | 'selfieWithId') {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.toastr.error('Please select an image file', 'Invalid File');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.toastr.error('File size must be less than 5MB', 'File Too Large');
                return;
            }

            // Store the file
            this.verificationFiles[fileType] = file;

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                this.verificationPreviews[fileType] = reader.result as string;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Check if all verification files are selected
     */
    get allVerificationFilesSelected(): boolean {
        return !!(this.verificationFiles.idCardFront &&
            this.verificationFiles.idCardBack &&
            this.verificationFiles.selfieWithId);
    }

    /**
     * Submit verification request
     */
    submitVerification() {
        if (!this.allVerificationFilesSelected) {
            this.toastr.warning('Please upload all three required photos', 'Missing Files');
            return;
        }

        this.isSubmittingVerification = true;
        this.agentService.submitVerification(this.verificationFiles).subscribe({
            next: (response) => {
                this.toastr.success('Your verification request has been submitted successfully. We will review your documents and notify you.', 'Verification Submitted');
                // Reset form
                this.verificationFiles = {
                    idCardFront: null,
                    idCardBack: null,
                    selfieWithId: null
                };
                this.verificationPreviews = {
                    idCardFront: null,
                    idCardBack: null,
                    selfieWithId: null
                };
                this.isSubmittingVerification = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to submit verification:', error);
                const errorMessage = error.error?.message || 'Failed to submit verification request. Please try again.';
                this.toastr.error(errorMessage, 'Verification Failed');
                this.isSubmittingVerification = false;
                this.cdr.detectChanges();
            }
        });
    }

    // Helper methods for Saved Properties
    getSavedPropertyTitle(saved: SavedPropertyDto): string {
        const prop = saved.property;
        if (this.currentLang === 'en') {
            return prop.titleEn || prop.title;
        }
        return prop.title;
    }

    getSavedPropertyLocation(saved: SavedPropertyDto): string {
        const prop = saved.property;
        if (this.currentLang === 'en') {
             const city = prop.cityEn || prop.city;
             // Only use district if we have an English version to avoid mixed languages (e.g. "Nasr City, Cairo" vs "مدينة نصر, Cairo")
             // If DistrictEn is missing, better to show just CityEn than Mixed.
             const district = prop.districtEn;
             
             if (district && city) {
                 return `${district}, ${city}`;
             }
             return city || prop.location || '';
        }
        // Arabic Mode
        const city = prop.city;
        const district = prop.district;
         if (district && city) {
             return `${district}, ${city}`;
         }
        // If constructed location fails, fallback to backend location string
        return prop.location || city || '';
    }

}

