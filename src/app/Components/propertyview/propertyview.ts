import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-propertyview',
  imports: [CommonModule],
  templateUrl: './propertyview.html',
  styleUrl: './propertyview.css',
})
export class Propertyview {
  price = 7300000;
  currency = 'EGP';
  installment = '18,400';
  installmentPeriod = '12 years';
  downPayment = '700,000';

  location = 'Privado, Madinaty, Cairo';
  title = 'Studio for sale in Privado lakes view';

  specs = {
    beds: 1,
    baths: 1,
    area: 63
  };

  description = [
    'Studio 1 bedroom 63m apartment',
    'lakes view wider',
    'prime location'
  ];

  propertySpecs = [
    { label: 'Type', value: 'Apartment' },
    { label: 'Purpose', value: 'For Sale' },
    { label: 'Reference no.', value: 'Bayut - 27652-IZUYUH' },
    { label: 'Completion', value: 'Off-Plan' },
    { label: 'Furnishing', value: 'Unfurnished' },
    { label: 'Published at', value: '28 November 2025' },
    { label: 'Ownership', value: 'Primary' }
  ];

  agent = {
    name: 'Ahmed Mohamed',
    company: 'Deal Real Estate',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Senior Property Consultant',
    experience: '5 Years',
    activeListings: 101
  };
}
