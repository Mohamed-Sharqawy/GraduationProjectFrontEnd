import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { API_EndPoints } from '../../../environments/api.config';
import { 
    CityDto, 
    DistrictDto, 
    ProjectDto, 
    PropertyTypeDto, 
    PropertyImageDto 
} from '../../Models/Lookups/lookup.models';

@Injectable({
    providedIn: 'root',
})
export class LookupService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // ==================== Cities ====================

    /**
     * Get all cities
     */
    getAllCities(): Observable<CityDto[]> {
        return this.http.get<CityDto[]>(`${this.baseUrl}${API_EndPoints.lookups.cities}`);
    }

    /**
     * Get city by ID
     */
    getCityById(id: number): Observable<CityDto> {
        return this.http.get<CityDto>(`${this.baseUrl}${API_EndPoints.lookups.cities}/${id}`);
    }

    // ==================== Districts ====================

    /**
     * Get all districts
     */
    getAllDistricts(): Observable<DistrictDto[]> {
        return this.http.get<DistrictDto[]>(`${this.baseUrl}${API_EndPoints.lookups.districts}`);
    }

    /**
     * Get district by ID
     */
    getDistrictById(id: number): Observable<DistrictDto> {
        return this.http.get<DistrictDto>(`${this.baseUrl}${API_EndPoints.lookups.districts}/${id}`);
    }

    /**
     * Get districts by city ID
     */
    getDistrictsByCityId(cityId: number): Observable<DistrictDto[]> {
        return this.http.get<DistrictDto[]>(`${this.baseUrl}${API_EndPoints.lookups.cities}/${cityId}/districts`);
    }

    // ==================== Projects ====================

    /**
     * Get all projects
     */
    getAllProjects(): Observable<ProjectDto[]> {
        return this.http.get<ProjectDto[]>(`${this.baseUrl}${API_EndPoints.lookups.projects}`);
    }

    /**
     * Get project by ID
     */
    getProjectById(id: number): Observable<ProjectDto> {
        return this.http.get<ProjectDto>(`${this.baseUrl}${API_EndPoints.lookups.projects}/${id}`);
    }

    // ==================== Property Types ====================

    /**
     * Get all property types
     */
    getAllPropertyTypes(): Observable<PropertyTypeDto[]> {
        return this.http.get<PropertyTypeDto[]>(`${this.baseUrl}${API_EndPoints.lookups.propertyTypes}`);
    }

    /**
     * Get property type by ID
     */
    getPropertyTypeById(id: number): Observable<PropertyTypeDto> {
        return this.http.get<PropertyTypeDto>(`${this.baseUrl}${API_EndPoints.lookups.propertyTypes}/${id}`);
    }

    // ==================== Property Images ====================

    /**
     * Get all images for a property
     */
    getPropertyImages(propertyId: number): Observable<PropertyImageDto[]> {
        return this.http.get<PropertyImageDto[]>(
            `${this.baseUrl}${API_EndPoints.lookups.propertyImages}/${propertyId}/images`
        );
    }
}
