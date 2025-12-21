import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  title = 'Homey';
  searchType: 'buy' | 'rent' = 'buy';

  blogArticles = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400',
      title: 'The New Ways Homes Are Becoming More Entertaining'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400',
      title: 'Why Smaller Units Moved to the Center of Demand'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400',
      title: 'Are Gated Communities Really Worth the Premium?'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400',
      title: "What's New in El Gouna?"
    }
  ];

  setSearchType(type: 'buy' | 'rent') {
    this.searchType = type;
  }
}
