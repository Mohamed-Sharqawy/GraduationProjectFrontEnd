import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { API_EndPoints } from '../../../environments/api.config';
import { PropertyFilterDto } from '../../Models/Property/property-filter.dto';
import { PropertyListItemDto } from '../../Models/Property/property-list-item.dto';
import { PagedResultDto } from '../../Models/Property/paged-result.dto';
import { Property } from '../../Models/Property/property';
import { PropertyDetailsDto, PropertyCardDto } from '../../Models/Property/PropertyDtos'; // Updated import
import { PaginatedResponse } from '../../Models/GenericPagination';

@Injectable({
    providedIn: 'root',
})
export class PropertyService {
    private apiUrl = environment.apiUrl + API_EndPoints.properties;
    private placeholderImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400';
    private placeholderLogo = 'https://marketplace.canva.com/EAGTwK0wOTg/2/0/1600w/canva-black-and-white-minimalistic-real-estate-flat-illustrative-logo-afTi-1EmZtc.jpg';

    constructor(private http: HttpClient) { }

    /**
     * Fetch properties from the backend API with optional filters
     */
    getProperties(filter?: PropertyFilterDto): Observable<PagedResultDto<Property>> {
        let params = new HttpParams();

        if (filter) {
            // Add all filter parameters to the query string
            if (filter.purpose !== undefined) params = params.set('purpose', filter.purpose.toString());
            if (filter.cityId !== undefined) params = params.set('cityId', filter.cityId.toString());
            if (filter.districtId !== undefined) params = params.set('districtId', filter.districtId.toString());
            if (filter.projectId !== undefined) params = params.set('projectId', filter.projectId.toString());
            if (filter.propertyTypeId !== undefined) params = params.set('propertyTypeId', filter.propertyTypeId.toString());
            if (filter.minPrice !== undefined) params = params.set('minPrice', filter.minPrice.toString());
            if (filter.maxPrice !== undefined) params = params.set('maxPrice', filter.maxPrice.toString());
            if (filter.minRentPrice !== undefined) params = params.set('minRentPrice', filter.minRentPrice.toString());
            if (filter.maxRentPrice !== undefined) params = params.set('maxRentPrice', filter.maxRentPrice.toString());
            if (filter.minArea !== undefined) params = params.set('minArea', filter.minArea.toString());
            if (filter.maxArea !== undefined) params = params.set('maxArea', filter.maxArea.toString());
            if (filter.minRooms !== undefined) params = params.set('minRooms', filter.minRooms.toString());
            if (filter.maxRooms !== undefined) params = params.set('maxRooms', filter.maxRooms.toString());
            if (filter.minBathrooms !== undefined) params = params.set('minBathrooms', filter.minBathrooms.toString());
            if (filter.status !== undefined) params = params.set('status', filter.status.toString());
            if (filter.finishingType !== undefined) params = params.set('finishingType', filter.finishingType.toString());
            if (filter.isFeatured !== undefined) params = params.set('isFeatured', filter.isFeatured.toString());
            if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
            if (filter.pageNumber !== undefined) params = params.set('pageNumber', filter.pageNumber.toString());
            if (filter.pageSize !== undefined) params = params.set('pageSize', filter.pageSize.toString());
            if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
            if (filter.sortDescending !== undefined) params = params.set('sortDescending', filter.sortDescending.toString());
        }

        return this.http.get<PagedResultDto<PropertyListItemDto>>(this.apiUrl, { params }).pipe(
            map(response => ({
                ...response,
                items: (response.items || []).map(item => this.mapToProperty(item))
            }))
        );
    }

    /**
     * Fetch a single property by ID
     */
    getProperty(id: number): Observable<PropertyDetailsDto> {
        return this.http.get<PropertyDetailsDto>(`${this.apiUrl}/${id}`);
    }

    // === NEW Methods for Agent Dashboard ===

    /**
     * Get agent's own properties
     */
    getMyProperties(filter: any): Observable<PaginatedResponse<PropertyCardDto>> {
        let params = new HttpParams();
        for (const key in filter) {
            if (filter[key] !== null && filter[key] !== undefined && filter[key] !== '') {
                params = params.set(key, filter[key].toString());
            }
        }
        return this.http.get<any>(`${this.apiUrl}/my-properties`, { params }).pipe(
            map(response => {
                const items = response.items || response.data || [];
                return {
                    ...response,
                    items: items
                } as PaginatedResponse<PropertyCardDto>;
            })
        );
    }

    /**
     * Create a new property
     */
    createProperty(formData: FormData): Observable<any> {
        return this.http.post(this.apiUrl, formData);
    }

    /**
     * Update an existing property
     */
    updateProperty(id: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, formData);
    }

    /**
     * Delete a property
     */
    deleteProperty(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }


    /**
     * Map backend DTO to frontend Property model
     */
    private mapToProperty(dto: PropertyListItemDto): Property {
        return {
            id: dto.id,
            title: dto.title,
            price: dto.price,
            rentPriceMonthly: dto.rentPrice || 0,
            currency: dto.currency || 'EGP',
            propertyType: dto.propertyType || 'Apartment',
            propertyTypeEn: dto.propertyType || 'Apartment',
            city: dto.cityName || '',
            cityEn: dto.cityName || '',
            district: dto.districtName || '',
            districtEn: dto.districtName || '',
            projectName: dto.projectName || '',
            area: dto.area,
            rooms: dto.bedrooms,
            bathrooms: dto.bathrooms,
            mainImageUrl: dto.imageUrl || dto.images?.[0] || this.placeholderImage,
            isFeatured: dto.isFeatured || false,
            status: this.mapStatus(dto.status),
            purpose: this.mapPurpose(dto.purpose),
            finishingType: this.mapFinishingType(dto.finishingType),
            location: dto.location || this.buildLocation(dto.cityName, dto.districtName, dto.projectName),
            viewCount: 0,
            createdAt: dto.createdAt || new Date().toISOString(),

            // Optional fields
            adType: dto.isFeatured ? 'Featured' : 'Standard',
            type: this.mapPropertyType(dto.propertyType),
            bedrooms: dto.bedrooms,
            description: dto.description || '',
            imageUrl: dto.imageUrl || dto.images?.[0] || this.placeholderImage,
            agentLogoUrl: this.placeholderLogo,
            downPayment: dto.price * 0.05, // Estimate 5% down payment
            monthlyInstallment: dto.price / 120, // Estimate 10-year installment
            developer: dto.ownerName || 'Unknown Developer',
            handoverDate: 'Q4 2026', // Default handover date

            // Agent fields
            agentId: '',
            agentName: dto.ownerName || 'Unknown Agent',
            agentProfileImage: this.placeholderLogo
        };
    }

    /**
     * Map property type from backend to frontend format
     */
    private mapPropertyType(type?: string): 'Apartment' | 'Villa' | 'Duplex' | 'Townhouse' | 'Studio' {
        if (!type) return 'Apartment';

        const normalized = type.toLowerCase();
        if (normalized.includes('villa')) return 'Villa';
        if (normalized.includes('duplex')) return 'Duplex';
        if (normalized.includes('townhouse')) return 'Townhouse';
        if (normalized.includes('studio')) return 'Studio';

        return 'Apartment';
    }

    /**
     * Map status code to frontend format
     */
    private mapStatus(status?: number): 'Off-Plan' | 'Ready' {
        // Status: 0=PendingReview, 1=Active, 2=SoldOrRented, 3=Hidden, 4=Rejected
        // For now, we'll default to 'Off-Plan' but this can be customized
        return 'Off-Plan';
    }

    private mapPurpose(purpose?: number): string {
        switch (purpose) {
            case 1: return 'Buy';
            case 2: return 'Rent';
            case 3: return 'Both';
            default: return 'Buy';
        }
    }

    private mapFinishingType(type?: number): string {
        switch (type) {
            case 0: return 'None';
            case 1: return 'Semi';
            case 2: return 'Full';
            default: return 'None';
        }
    }

    /**
     * Build location string from city, district, and project
     */
    private buildLocation(city?: string, district?: string, project?: string): string {
        const parts = [project, district, city].filter(Boolean);
        return parts.join(', ') || 'Egypt';
    }
}
