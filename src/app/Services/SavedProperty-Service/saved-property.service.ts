import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { API_EndPoints } from '../../../environments/api.config';
import {
    SavedPropertyDto,
    ToggleSaveResponse,
    IsSavedResponse
} from '../../Models/SavedProperty/saved-property.models';

@Injectable({
    providedIn: 'root'
})
export class SavedPropertyService {
    private apiUrl = environment.apiUrl + API_EndPoints.savedProperties;

    constructor(private http: HttpClient) { }

    /**
     * Get all saved properties for the authenticated user
     */
    getMySavedProperties(): Observable<SavedPropertyDto[]> {
        return this.http.get<SavedPropertyDto[]>(this.apiUrl);
    }

    /**
     * Save a property for the authenticated user
     */
    saveProperty(propertyId: number): Observable<{ message: string; propertyId: number }> {
        return this.http.post<{ message: string; propertyId: number }>(`${this.apiUrl}/${propertyId}`, {});
    }

    /**
     * Unsave (remove) a property for the authenticated user
     */
    unsaveProperty(propertyId: number): Observable<{ message: string; propertyId: number }> {
        return this.http.delete<{ message: string; propertyId: number }>(`${this.apiUrl}/${propertyId}`);
    }

    /**
     * Check if a property is saved by the authenticated user
     */
    isPropertySaved(propertyId: number): Observable<IsSavedResponse> {
        return this.http.get<IsSavedResponse>(`${this.apiUrl}/${propertyId}/is-saved`);
    }

    /**
     * Toggle save/unsave property (Heart icon click)
     */
    toggleSaveProperty(propertyId: number): Observable<ToggleSaveResponse> {
        return this.http.post<ToggleSaveResponse>(`${this.apiUrl}/${propertyId}/toggle`, {});
    }
}
