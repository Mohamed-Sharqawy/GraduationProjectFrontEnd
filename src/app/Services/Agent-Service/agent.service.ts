import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { API_EndPoints } from '../../../environments/api.config';
import { AgentProfileDto } from '../../Models/Agent/agent-profile.dto';
import { Agent } from '../../Models/Agents/Agents';
import { PaginatedResponse } from '../../Models/GenericPagination';
import { AgentFilterDto } from '../../Models/Agents/agent-filter.dto';
import { VerificationFiles } from '../../Models/Verification/verification.models';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private apiUrl = environment.apiUrl + API_EndPoints.agents;

    constructor(private http: HttpClient) { }

    getAgentProfile(id: string): Observable<AgentProfileDto> {
        return this.http.get<AgentProfileDto>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get all agents with pagination and filtering
     */
    getAllAgents(filter: AgentFilterDto): Observable<PaginatedResponse<Agent>> {
        let params = new HttpParams();

        if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
        if (filter.cityId) params = params.set('cityId', filter.cityId.toString());
        if (filter.purpose) params = params.set('purpose', filter.purpose.toString());
        if (filter.isVerified !== undefined) params = params.set('isVerified', filter.isVerified.toString());

        // Defaults if not provided
        params = params.set('pageNumber', (filter.pageNumber || 1).toString());
        params = params.set('pageSize', (filter.pageSize || 10).toString());

        if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
        if (filter.sortDescending !== undefined) params = params.set('sortDescending', filter.sortDescending.toString());

        return this.http.get<PaginatedResponse<Agent>>(this.apiUrl, { params });
    }

    /**
     * Submit identity verification request with ID photos
     */
    submitVerification(files: VerificationFiles): Observable<any> {
        const formData = new FormData();

        if (files.idCardFront) {
            formData.append('IdCardFront', files.idCardFront);
        }
        if (files.idCardBack) {
            formData.append('IdCardBack', files.idCardBack);
        }
        if (files.selfieWithId) {
            formData.append('SelfieWithId', files.selfieWithId);
        }

        return this.http.post(`${this.apiUrl}/verify-identity`, formData);
    }
}
