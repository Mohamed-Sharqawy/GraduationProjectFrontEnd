import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  title = 'Homey';

  heroImages: string[] = [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1600',
    'https://images.unsplash.com/photo-1600596542815-e32cbb65a780?q=80&w=1600',
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
}
