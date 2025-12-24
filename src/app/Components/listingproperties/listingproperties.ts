import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Property } from '../../Models/Property/property';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../Services/Property-Service/property.service';
import { PropertyFilterDto } from '../../Models/Property/property-filter.dto';

@Component({
  selector: 'app-listingproperties',
  imports: [CommonModule, RouterModule],
  templateUrl: './listingproperties.html',
  styleUrls: ['./listingproperties.css'],
})
export class Listingproperties implements OnInit {
  properties: Property[] = [];
  isLoading = false;
  errorMessage = '';

  // Pagination metadata
  totalCount = 0;
  pageNumber = 1;
  pageSize = 20;
  totalPages = 0;

  constructor(
    private propertyService: PropertyService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.isLoading = true;
    this.errorMessage = '';

    const filter: PropertyFilterDto = {
      status: 1, // Active properties only
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortBy: 'CreatedAt',
      sortDescending: true
    };

    console.log('🏠 Loading properties from API...');

    this.propertyService.getProperties(filter).subscribe({
      next: (response) => {
        console.log('✅ Properties loaded successfully:', response);
        this.properties = response.items.sort((a, b) => {
          const priority: { [key: string]: number } = { 'Premium': 0, 'Featured': 1, 'Standard': 2 };
          return (priority[a.adType || 'Standard'] || 2) - (priority[b.adType || 'Standard'] || 2);
        });
        this.totalCount = response.totalCount;
        this.pageNumber = response.pageNumber;
        this.pageSize = response.pageSize;
        this.totalPages = response.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Failed to load properties:', error);
        this.errorMessage = 'Failed to load properties. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
