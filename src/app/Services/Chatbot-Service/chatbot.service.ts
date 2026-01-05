import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, tap } from 'rxjs';
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

  // Store sessionId for conversation continuity
  private currentSessionId: string | null = null;

  /**
   * Get welcome message
   */
  getWelcomeMessage(): Observable<ChatbotWelcomeResponse> {
    const lang = this.translationService.currentLang();
    const headers = { 'Accept-Language': lang };
    return this.http.get<ChatbotWelcomeResponse>(`${this.apiUrl}/welcome`, { headers });
  }

  /**
   * Send message to AI with session continuity
   */
  ask(message: string): Observable<ChatbotAskResponse> {
    const headers = { 'Content-Type': 'application/json' };
    const body: ChatbotAskRequest = {
      message: message,
      sessionId: this.currentSessionId // Send current sessionId if exists
    };
    
    return this.http.post<ChatbotAskResponse>(`${this.apiUrl}/ask`, body, { headers })
      .pipe(
        timeout(120000), // 2 minutes timeout
        tap(response => {
          // Store sessionId from response for next request
          if (response.sessionId) {
            this.currentSessionId = response.sessionId;
            console.log('Session ID updated:', this.currentSessionId);
          }
        })
      );
  }

  /**
   * Clear current session (e.g., when user starts new conversation)
   */
  clearSession(): void {
    this.currentSessionId = null;
    console.log('Session cleared');
  }

  /**
   * Get similar properties
   */
  getSimilarProperties(propertyId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/similar/${propertyId}`, {});
  }
}
