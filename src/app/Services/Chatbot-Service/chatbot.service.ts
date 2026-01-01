import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ChatbotAskRequest, ChatbotAskResponse, ChatbotWelcomeResponse } from '../../Models/Chatbot/chatbot.models';
import { TranslationService } from '../Translation-Service/translation.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  // Using direct URL as requested by user instead of environment
  private apiUrl = `https://homyapi.runasp.net/api/chatbot`;

  private translationService = inject(TranslationService);

  /**
   * Get welcome message
   */
  getWelcomeMessage(): Observable<ChatbotWelcomeResponse> {
    const lang = this.translationService.currentLang();
    const headers = { 'Accept-Language': lang };
    return this.http.get<ChatbotWelcomeResponse>(`${this.apiUrl}/welcome`, { headers });
  }

  /**
   * Send message to AI
   */
  ask(message: string): Observable<ChatbotAskResponse> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<ChatbotAskResponse>(`${this.apiUrl}/ask`, { message: message }, { headers })
      .pipe(timeout(120000)); // 2 minutes timeout
  }

  /**
   * Get similar properties
   */
  getSimilarProperties(propertyId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/similar/${propertyId}`, {});
  }
}
