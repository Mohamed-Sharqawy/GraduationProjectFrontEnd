import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { PropertyListItemDto } from '../../Models/Property/property-list-item.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = environment.apiUrl + '/Chatbot';

  constructor(private http: HttpClient) { }

  /**
   * Get similar properties for a given property ID
   */
  getSimilarProperties(propertyId: number): Observable<{ success: boolean; similarProperties: PropertyListItemDto[] }> {
    return this.http.post<{ success: boolean; similarProperties: PropertyListItemDto[] }>(
      `${this.apiUrl}/similar/${propertyId}`,
      {}
    );
  }
}
