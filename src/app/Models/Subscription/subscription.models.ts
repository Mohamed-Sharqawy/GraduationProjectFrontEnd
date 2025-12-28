export interface PackageDto {
    id: number;
    name: string;
    price: number;
    durationDays: number;
    maxProperties: number;
    maxFeatured: number;
    canBumpUp: boolean;
}

export interface SubscriptionStatusDto {
    hasActiveSubscription: boolean;
    packageName?: string;
    packagePrice?: number;
    startDate?: Date;
    endDate?: Date;
    daysRemaining: number;
    propertiesUsed: number;
    propertiesLimit: number;
    featuredUsed: number;
    featuredLimit: number;
    propertiesRemaining: number;
    featuredRemaining: number;
}

export interface PayPalOrderResponse {
    orderId: string;
    approvalUrl: string;
}

export interface CreatePayPalOrderDto {
    packageId: number;
}

export interface CapturePayPalPaymentDto {
    packageId: number;
    payPalOrderId: string;
    payPalPayerId?: string;
}

export interface CanAddPropertyDto {
    canAdd: boolean;
    errorMessage?: string;
    errorCode?: string;
}
