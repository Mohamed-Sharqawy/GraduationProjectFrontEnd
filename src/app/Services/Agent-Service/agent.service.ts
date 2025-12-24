import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { API_EndPoints } from '../../../environments/api.config';
import { AgentProfileDto } from '../../Models/Agent/agent-profile.dto';

@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private apiUrl = environment.apiUrl + API_EndPoints.agents;

    constructor(private http: HttpClient) { }

    getAgentProfile(id: string): Observable<AgentProfileDto> {
        return this.http.get<AgentProfileDto>(`${this.apiUrl}/${id}`);
    }
}
