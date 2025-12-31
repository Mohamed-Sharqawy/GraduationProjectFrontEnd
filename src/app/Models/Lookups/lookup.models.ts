// City DTO
export interface CityDto {
    id: number;
    name: string;
    nameEn?: string;
    districtsCount: number;
    propertiesCount: number;
}

// District DTO
export interface DistrictDto {
    id: number;
    name: string;
    nameEn?: string;
    cityId: number;
    cityName: string;
    propertiesCount: number;
}

// Project DTO
export interface ProjectDto {
    id: number;
    name: string;
    nameEn?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    cityId: number;
    cityName: string;
    districtId?: number;
    districtName?: string;
    locationDescription?: string;
    locationDescriptionEn?: string;
    isActive: boolean;
    propertiesCount: number;
    minPrice?: number;
    minArea?: number;
    maxArea?: number;
    year?: number;
    developerName?: string;
}

// Property Type DTO
export interface PropertyTypeDto {
    id: number;
    name: string;
    nameEn?: string;
    iconUrl?: string;
    propertiesCount: number;
}

// Property Image DTO
export interface PropertyImageDto {
    id: number;
    propertyId: number;
    imageUrl: string;
    isMain: boolean;
    isPrimary: boolean;
    sortOrder: number;
}
