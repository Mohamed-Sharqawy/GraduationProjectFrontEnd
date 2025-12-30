import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  title = 'Homey';

  private router = inject(Router);
  public authService = inject(AuthService);

  heroImages: string[] = [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600',
    
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600'
  ];

  currentSlide = 0;
  private slideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.heroImages.length;
  }

  handleSellProperty() {
    if (this.authService.isLoggedIn()) {
      // User is logged in, verify if they have subscription or just go to profile
      // The requirement says: "redirect the user to the profile view to the list property section"
      // We'll direct them to user-profile with published tab active
      this.router.navigate(['/user-profile'], { queryParams: { tab: 'published' } });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
