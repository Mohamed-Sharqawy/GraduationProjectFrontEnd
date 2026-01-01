export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  type: string; // Info, Success, Warning, Error
  isRead: boolean;
  createdAt: string; // ISO date string
  relatedEntityId?: number;
  relatedEntityType?: string; // Property, Subscription, etc.
}

export interface NotificationListResponse {
  items: NotificationDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface UnreadCountResponse {
  count: number;
}
