import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { NotificationDto, NotificationListResponse, UnreadCountResponse } from '../../Models/Notification/notification.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Notifications`;

  /**
   * Get notifications with pagination
   */
  getNotifications(pageNumber: number = 1, pageSize: number = 20, unreadOnly: boolean = false): Observable<NotificationListResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (unreadOnly) {
      params = params.set('unreadOnly', 'true');
    }

    return this.http.get<NotificationListResponse>(this.apiUrl, { params });
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(): Observable<UnreadCountResponse> {
    return this.http.get<UnreadCountResponse>(`${this.apiUrl}/unread-count`);
  }

  /**
   * Mark a single notification as read
   */
  markAsRead(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/mark-read`, {});
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-all-read`, {});
  }
}
