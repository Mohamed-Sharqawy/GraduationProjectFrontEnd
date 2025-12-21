import { Component } from '@angular/core';

@Component({
  selector: 'app-propertyview',
  imports: [],
  templateUrl: './propertyview.html',
  styleUrl: './propertyview.css',
})
export class Propertyview {
  propertySpecs = [
    { label: 'Type', value: 'Apartment' },
    { label: 'Purpose', value: 'For Sale' },
    { label: 'Furnishing', value: 'Unfurnished' },
    { label: 'Ownership', value: 'Primary' },
    { label: 'Completion', value: 'Off-Plan' },
    { label: 'Published at', value: '20 December 2025' }
  ];
}
