export interface PropertyCardDto {
    id: number;
    title: string;
    titleEn?: string;
    price: number;
    propertyType: string;
    propertyTypeEn?: string;
    city: string;
    cityEn?: string;
    district?: string;
    districtEn?: string;
    primaryImageUrl?: string;
    purpose: number; // 1=Buy, 2=Rent
    status: string; // 'PendingReview', 'Active', 'SoldOrRented', 'Hidden', 'Rejected'
    rooms?: number;
    bathrooms?: number;
    area?: number;
    isFeatured: boolean;
    createdAt: string;
    rejectionReason?: string;
}

export interface CreatePropertyDto {
    Title: string;
    Description?: string;
    TitleEn?: string;
    DescriptionEn?: string;
    CityId: number;
    DistrictId?: number;
    ProjectId?: number;
    AddressDetails?: string;
    AddressDetailsEn?: string;
    Latitude?: number;
    Longitude?: number;
    PropertyTypeId: number;
    Purpose: number; // 0=Buy, 1=Rent (Check backend enum) - logic in service will map
    Price: number;
    RentPriceMonthly?: number;
    Rooms?: number;
    Bathrooms?: number;
    Area?: number;
    FinishingType?: number; // 0=None, 1=Semi, 2=Full
    FloorNumber?: number;
    IsAgricultural: boolean;
    IsFeatured: boolean;
    PrimaryImageIndex: number;
    // Images handled separately as FormData
}

export interface PropertyFilterDto {
    Purpose?: number;
    CityId?: number;
    DistrictId?: number;
    PropertyTypeId?: number;
    MinPrice?: number;
    MaxPrice?: number;
    // ... add others as needed
    PageNumber: number;
    PageSize: number;
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
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
    whatsAppNumber?: string;
    profileImageUrl?: string;
    isVerified: boolean;
    activePropertiesCount: number;
}

export interface PropertyDetailsDto {
    id: number;
    title: string;
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
    price: number;
    rentPriceMonthly?: number;
    currency: string;
    propertyTypeId: number;
    propertyType: string;
    propertyTypeEn?: string;
    cityId: number;
    city: string;
    cityEn?: string;
    districtId?: number;
    district?: string;
    districtEn?: string;
    projectId?: number;
    projectName?: string;
    projectNameEn?: string;
    addressDetails?: string;
    addressDetailsEn?: string;
    latitude?: number;
    longitude?: number;
    area?: number;
    rooms?: number;
    bathrooms?: number;
    floorNumber?: number;
    status: string;
    purpose: string;
    finishingType?: string;
    isFeatured: boolean;
    featuredUntil?: string;
    isAgricultural: boolean;
    images: PropertyImageDto[];
    amenities: AmenityDto[];
    agent: AgentInfoDto;
    viewCount: number;
    whatsAppClicks: number;
    phoneClicks: number;
    createdAt: string;
    updatedAt?: string;
}
