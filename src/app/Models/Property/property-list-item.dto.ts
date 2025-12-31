export interface PropertyListItemDto {
    id: number;
    title: string;
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
    price: number;
    rentPriceMonthly?: number;
    currency?: string;
    
    // Property Type
    propertyType?: string;
    propertyTypeEn?: string;
    
    // Location
    city?: string;
    cityEn?: string;
    district?: string;
    districtEn?: string;
    projectName?: string;
    projectNameEn?: string;
    projectLogoUrl?: string;
    
    // Specs
    area?: number;
    rooms?: number;
    bathrooms?: number;
    
    // Images
    mainImageUrl?: string;
    
    // Status & Features
    isFeatured?: boolean;
    status?: string;
    purpose?: string; // ForSale, ForRent, Both
    finishingType?: string;
    
    // Agent/Owner Info
    agentId?: string;
    agentName?: string;
    agentProfileImage?: string;
    
    // Additional Info
    createdAt?: string;
    viewCount?: number;
    
    // Computed
    location?: string;
}
