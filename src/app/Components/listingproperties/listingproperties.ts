import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Property } from '../../Models/Property/property';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listingproperties',
  imports: [CommonModule, RouterModule],
  templateUrl: './listingproperties.html',
  styleUrl: './listingproperties.css',
})
export class Listingproperties {
  properties: Property[] = [
    {
      id: 1,
      price: 11600000,
      currency: 'EGP',
      title: 'Luxury Duplex with 76,000 EGP monthly installments',
      type: 'Duplex',
      status: 'Off-Plan',
      adType: 'Premium',
      bedrooms: 3,
      bathrooms: 3,
      area: 158,
      location: 'Sarai, Mostakbal City, Cairo',
      description: 'With 76,000 EGP monthly installments own a 158 m² duplex in a prime location...',
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400', // Replace with your image paths
      agentLogoUrl: 'https://marketplace.canva.com/EAGTwK0wOTg/2/0/1600w/canva-black-and-white-minimalistic-real-estate-flat-illustrative-logo-afTi-1EmZtc.jpg',
      downPayment: 580000
    },
    {
      id: 2,
      price: 3595500,
      currency: 'EGP',
      title: 'Special Discount on Sky New Heliopolis Apartments',
      type: 'Apartment',
      status: 'Off-Plan',
      adType: 'Featured',
      bedrooms: 3,
      bathrooms: 3,
      area: 150,
      location: 'New Heliopolis, Cairo',
      description: 'Own your apartment now with 0% down payment and installments over 10 years...',
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400',
      agentLogoUrl: 'https://marketplace.canva.com/EAGTwK0wOTg/2/0/1600w/canva-black-and-white-minimalistic-real-estate-flat-illustrative-logo-afTi-1EmZtc.jpg'
    },
    {
      id: 3,
      price: 12000000,
      currency: 'EGP',
      title: 'Apartment with garden at the lowest price',
      type: 'Apartment',
      status: 'Off-Plan',
      adType: 'Standard',
      bedrooms: 1,
      bathrooms: 2,
      area: 90,
      location: 'Karmell Compound, Sheikh Zayed, Giza',
      description: 'Prime location, installments available, close to services...',
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400',
      agentLogoUrl: 'https://marketplace.canva.com/EAGTwK0wOTg/2/0/1600w/canva-black-and-white-minimalistic-real-estate-flat-illustrative-logo-afTi-1EmZtc.jpg'
    }
  ];

  get sortedProperties() {
    return this.properties.sort((a, b) => {
      const priority = { 'Premium': 0, 'Featured': 1, 'Standard': 2 };
      return priority[a.adType] - priority[b.adType];
    });
  }
}
