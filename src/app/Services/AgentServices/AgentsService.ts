import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/Development/environment';
import { Agent } from '../../Models/Agents/Agents';
import { PaginatedResponse } from '../../Models/GenericPagination';
import { AgentProfile } from '../../Models/Agents/Agents';

@Injectable({
    providedIn: 'root'
})
export class AgentsService {

    private apiUrl = environment.baseUrl + '/Agents';

    constructor(private http: HttpClient) { }

    getAllAgents(page: number = 1, size: number = 10): Observable<PaginatedResponse<Agent>> {

        let params = new HttpParams()
            .set('pageNumber', page.toString())
            .set('pageSize', size.toString());

        return this.http.get<PaginatedResponse<Agent>>(this.apiUrl, { params });
    }

    getAgentProfile(id: string): Observable<AgentProfile> {
    
    const url = `${this.apiUrl}/${id}`; 

    return this.http.get<AgentProfile>(url);
  }
}