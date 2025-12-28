import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { API_EndPoints } from '../../../environments/api.config';
import {
    PackageDto,
    SubscriptionStatusDto,
    PayPalOrderResponse,
    CreatePayPalOrderDto,
    CapturePayPalPaymentDto,
    CanAddPropertyDto
} from '../../Models/Subscription/subscription.models';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private apiUrl = environment.apiUrl + API_EndPoints.subscriptions;

    constructor(private http: HttpClient) {
        console.log('SubscriptionService initialized');
        console.log('Environment API URL:', environment.apiUrl);
        console.log('API Endpoint:', API_EndPoints.subscriptions);
        console.log('Full Service URL:', this.apiUrl);
    }

    /**
     * Get all available subscription packages
     */
    getPackages(): Observable<PackageDto[]> {
        console.log('Fetching packages from:', `${this.apiUrl}/packages`);
        return this.http.get<PackageDto[]>(`${this.apiUrl}/packages`);
    }

    /**
     * Get current user's subscription status
     */
    getSubscriptionStatus(): Observable<SubscriptionStatusDto> {
        return this.http.get<SubscriptionStatusDto>(`${this.apiUrl}/status`);
    }

    /**
     * Create a PayPal order for a package subscription
     */
    createPayPalOrder(packageId: number): Observable<PayPalOrderResponse> {
        const dto: CreatePayPalOrderDto = { packageId };
        return this.http.post<PayPalOrderResponse>(`${this.apiUrl}/create-order`, dto);
    }

    /**
     * Capture PayPal payment after user approval
     */
    capturePayment(dto: CapturePayPalPaymentDto): Observable<{ success: boolean; message: string }> {
        return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/capture-payment`, dto);
    }

    /**
     * Check if user can add a property (based on subscription limits)
     */
    canAddProperty(isFeatured: boolean = false): Observable<CanAddPropertyDto> {
        return this.http.get<CanAddPropertyDto>(`${this.apiUrl}/can-add-property`, {
            params: { isFeatured: isFeatured.toString() }
        });
    }
}
