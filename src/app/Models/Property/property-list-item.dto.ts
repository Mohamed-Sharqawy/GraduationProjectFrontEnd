export interface PropertyListItemDto {
    id: number;
    title: string;
    description?: string;
    price: number;
    rentPrice?: number;
    currency?: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    propertyType?: string;
    purpose?: number; // 1=Buy, 2=Rent, 3=Both
    status?: number; // 0=PendingReview, 1=Active, 2=SoldOrRented, 3=Hidden, 4=Rejected
    finishingType?: number; // 0=None, 1=Semi, 2=Full
    isFeatured?: boolean;
    imageUrl?: string;
    images?: string[];
    location?: string;
    cityName?: string;
    districtName?: string;
    projectName?: string;
    ownerName?: string;
    ownerPhone?: string;
    createdAt?: string;
    updatedAt?: string;
}
