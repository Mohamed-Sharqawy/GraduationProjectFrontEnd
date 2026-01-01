import { Component, signal, inject, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './Services/Auth-Service/auth-service';
import { Footer } from './Components/footer/footer';
import { UserRole } from './Models/user-role';
import { TranslationService } from './Services/Translation-Service/translation.service';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from './Services/Notification-Service/notification.service';
import { NotificationDto } from './Models/Notification/notification.models';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Footer, TranslateModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('HomeyUI');
  protected readonly authService = inject(AuthService);
  public readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  // Notification state
  unreadCount = 0;
  notifications: NotificationDto[] = [];
  isNotificationDropdownOpen = false;
  isLoadingNotifications = false;
  currentPage = 1;
  pageSize = 10;
  hasMoreNotifications = true;

  ngOnInit() {
    // Load unread count on init if user is logged in
    if (this.authService.isLoggedIn()) {
      this.loadUnreadCount();
      // Preload notifications so dropdown opens instantly
      this.loadNotifications();
      
      // Refresh count every 10 seconds (faster updates)
      setInterval(() => {
        if (this.authService.isLoggedIn()) {
          this.loadUnreadCount();
          // Also refresh notifications if dropdown is open
          if (this.isNotificationDropdownOpen) {
            this.refreshNotifications();
          }
        }
      }, 3000); // Changed from 30000 to 10000 (10 seconds)
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Check if click is outside notification bell and dropdown
    if (!target.closest('.notification-container')) {
      this.isNotificationDropdownOpen = false;
    }
  }

  /**
   * Load unread notifications count
   */
  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (response) => {
        console.log('📊 Unread count response:', response);
        this.unreadCount = response.count;
        console.log('🔔 Unread count set to:', this.unreadCount);
      },
      error: (err) => {
        console.error('❌ Failed to load unread count:', err);
      }
    });
  }

  /**
   * Toggle notification dropdown
   */
  toggleNotificationDropdown(event: Event) {
    event.stopPropagation();
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    
    // No need to reload if we already have notifications (preloaded)
    // Just mark all as read when opening
    if (this.isNotificationDropdownOpen) {
      this.markAllAsRead();
    }
  }

  /**
   * Refresh notifications (reload from server)
   */
  refreshNotifications() {
    this.currentPage = 1;
    this.hasMoreNotifications = true;
    this.loadNotifications(false);
  }

  /**
   * Load notifications
   */
  loadNotifications(append: boolean = false) {
    if (this.isLoadingNotifications || !this.hasMoreNotifications) return;

    console.log(`📥 Loading notifications - Page: ${this.currentPage}, Append: ${append}`);
    this.isLoadingNotifications = true;
    this.notificationService.getNotifications(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('✅ Notifications loaded:', response);
        if (append) {
          this.notifications = [...this.notifications, ...response.items];
        } else {
          this.notifications = response.items;
        }
        this.hasMoreNotifications = response.hasNextPage;
        this.isLoadingNotifications = false;
        console.log(`📋 Total notifications now: ${this.notifications.length}`);
      },
      error: (err) => {
        console.error('❌ Failed to load notifications:', err);
        this.isLoadingNotifications = false;
      }
    });
  }

  /**
   * Load more notifications (infinite scroll)
   */
  loadMoreNotifications() {
    if (this.hasMoreNotifications && !this.isLoadingNotifications) {
      this.currentPage++;
      this.loadNotifications(true);
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.unreadCount = 0;
        this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
      },
      error: (err) => console.error('Failed to mark all as read:', err)
    });
  }

  /**
   * On scroll in notification dropdown
   */
  onNotificationScroll(event: Event) {
    const element = event.target as HTMLElement;
    const threshold = 100; // Load more when 100px from bottom
    
    if (element.scrollHeight - element.scrollTop - element.clientHeight < threshold) {
      this.loadMoreNotifications();
    }
  }

  /**
   * Get time ago string (supports Arabic and English)
   */
  getTimeAgo(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return dateString;
      }
      
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      const isArabic = this.translationService.currentLang() === 'ar';

      if (seconds < 60) {
        return isArabic ? 'الآن' : 'Just now';
      }
      
      const minutes = Math.floor(seconds / 60);
      if (seconds < 3600) {
        return isArabic ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
      }
      
      const hours = Math.floor(seconds / 3600);
      if (seconds < 86400) {
        return isArabic ? `منذ ${hours} ساعة` : `${hours}h ago`;
      }
      
      const days = Math.floor(seconds / 86400);
      if (seconds < 604800) {
        return isArabic ? `منذ ${days} يوم` : `${days}d ago`;
      }
      
      // Format date for older notifications
      return date.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return dateString;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  /**
   * Check if current user is an Agent
   */
  isAgent(): boolean {
    return this.authService.currentUser()?.role === UserRole.Agent;
  }

  /**
   * Check if current user is an Owner
   */
  isOwner(): boolean {
    return this.authService.currentUser()?.role === UserRole.Owner;
  }
}
