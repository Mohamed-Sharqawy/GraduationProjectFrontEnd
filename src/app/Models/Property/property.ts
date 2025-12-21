export interface Property {
    id: number;
    price: number;
    currency: string;
    title: string;
    type: 'Apartment' | 'Villa' | 'Duplex' | 'Townhouse' | 'Studio';
    status: 'Off-Plan' | 'Ready';
    adType: 'Premium' | 'Featured' | 'Standard';
    bedrooms: number;
    bathrooms: number;
    area: number;
    location: string;
    description: string;
    imageUrl: string;
    agentLogoUrl: string;
    downPayment?: number;
    monthlyInstallment?: number;
    developer?: string;
    handoverDate?: string;
}
