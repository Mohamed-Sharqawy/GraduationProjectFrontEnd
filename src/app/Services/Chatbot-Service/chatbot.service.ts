import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ChatbotAskRequest, ChatbotAskResponse, ChatbotWelcomeResponse } from '../../Models/Chatbot/chatbot.models';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  // Using direct URL as requested by user instead of environment
  private apiUrl = `https://homyapi.runasp.net/api/chatbot`;

  /**
   * Get welcome message
   */
  getWelcomeMessage(): Observable<ChatbotWelcomeResponse> {
    return this.http.get<ChatbotWelcomeResponse>(`${this.apiUrl}/welcome`);
  }

  /**
   * Send message to AI
   */
  ask(message: string): Observable<ChatbotAskResponse> {
    return this.http.post<ChatbotAskResponse>(`${this.apiUrl}/ask`, { message });
  }

  /**
   * Get similar properties
   */
  getSimilarProperties(propertyId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/similar/${propertyId}`, {});
  }
}
