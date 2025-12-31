import { Component, OnInit, ChangeDetectorRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService } from '../../Services/Subscription-Service/subscription.service';
import { CapturePayPalPaymentDto } from '../../Models/Subscription/subscription.models';

@Component({
    selector: 'app-payment-callback',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './payment-callback.html',
    styleUrl: './payment-callback.css'
})
export class PaymentCallbackComponent implements OnInit {
    loading = true;
    success = false;
    message = '';
    status: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private subscriptionService: SubscriptionService,
        private cdr: ChangeDetectorRef
    ) {
        afterNextRender(() => {
            this.processPayment();
        });
    }

    ngOnInit(): void {
        // Additional initialization if needed for non-SSR
    }

    private processPayment(): void {
        const token = this.route.snapshot.queryParamMap.get('token');
        const payerID = this.route.snapshot.queryParamMap.get('PayerID');
        this.status = this.route.snapshot.queryParamMap.get('status');

        console.log('Payment Callback - Token:', token);
        console.log('Payment Callback - PayerID:', payerID);
        console.log('Payment Callback - Status:', this.status);

        // Handle cancelled payment
        if (this.status === 'cancelled') {
            this.loading = false;
            this.success = false;
            this.message = 'تم إلغاء عملية الدفع';
            this.cdr.detectChanges();
            return;
        }

        // Handle success - capture the payment
        if (this.status === 'success' && token && payerID) {
            // Get packageId from localStorage (should be saved before redirecting to PayPal)
            const storedPackageId = localStorage.getItem('pendingPackageId');
            const packageId = storedPackageId ? parseInt(storedPackageId) : 0;

            if (!packageId) {
                this.loading = false;
                this.success = false;
                this.message = 'خطأ: لم يتم العثور على معرف الباقة. يرجى المحاولة مرة أخرى.';
                this.cdr.detectChanges();
                return;
            }

            const captureDto: CapturePayPalPaymentDto = {
                payPalOrderId: token,
                payPalPayerId: payerID,
                packageId: packageId
            };

            console.log('Capturing payment with:', captureDto);

            this.subscriptionService.capturePayment(captureDto).subscribe({
                next: (response) => {
                    console.log('Payment captured successfully:', response);
                    this.loading = false;
                    this.success = response.success;
                    this.message = response.success 
                        ? 'تم تفعيل الاشتراك بنجاح! 🎉' 
                        : response.message || 'حدث خطأ غير متوقع';
                    
                    // Clear the stored packageId
                    localStorage.removeItem('pendingPackageId');
                    
                    this.cdr.detectChanges();

                    // Redirect to dashboard after 3 seconds if successful
                    if (response.success) {
                        setTimeout(() => {
                            this.router.navigate(['/user-dashboard']);
                        }, 3000);
                    }
                },
                error: (error) => {
                    console.error('Error capturing payment:', error);
                    this.loading = false;
                    this.success = false;
                    this.message = error.error?.message || 'حدث خطأ أثناء معالجة الدفع. يرجى التواصل مع الدعم.';
                    this.cdr.detectChanges();
                }
            });
        } else {
            // Invalid callback data
            this.loading = false;
            this.success = false;
            this.message = 'بيانات الدفع غير صحيحة. يرجى المحاولة مرة أخرى.';
            this.cdr.detectChanges();
        }
    }

    goToPackages(): void {
        this.router.navigate(['/home']); // Adjust to your packages page route
    }

    goToDashboard(): void {
        this.router.navigate(['/user-dashboard']);
    }
}
