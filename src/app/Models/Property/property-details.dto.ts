
export interface PropertyDetailsDto {
    id: number;
    title: string;
    description?: string;

    // Pricing
    price: number;
    rentPriceMonthly?: number;
    currency: string;

    // Property Type
    propertyTypeId: number;
    propertyType: string;
    propertyTypeEn?: string;

    // Location
    cityId: number;
    city: string;
    cityEn?: string;
    districtId?: number;
    district?: string;
    districtEn?: string;
    projectId?: number;
    projectName?: string;
    addressDetails?: string;
    latitude?: number;
    longitude?: number;

    // Specs
    area?: number;
    rooms?: number; // byte in C# -> number in TS
    bathrooms?: number; // byte in C# -> number in TS
    floorNumber?: number; // byte in C# -> number in TS

    // Status & Features
    status: string;
    purpose: string;
    finishingType?: string;
    isFeatured: boolean;
    featuredUntil?: string; // DateTime
    isAgricultural: boolean;

    // Images
    images: PropertyImageDto[];

    // Amenities
    amenities: AmenityDto[];

    // Agent/Owner Info
    agent: AgentInfoDto;

    // Stats
    viewCount: number;
    whatsAppClicks: number;
    phoneClicks: number;

    // Dates
    createdAt: string;
    updatedAt?: string;
}

export interface PropertyImageDto {
    id: number;
    imageUrl: string;
    isMain: boolean;
    sortOrder: number;
}

export interface AmenityDto {
    id: number;
    name: string;
    nameEn?: string;
    iconUrl?: string;
}

export interface AgentInfoDto {
    id: string; // Guid
    fullName: string;
    email?: string;
    phone?: string;
    whatsAppNumber?: string;
    profileImageUrl?: string;
    isVerified: boolean;
    activePropertiesCount: number;
}
