import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Property } from '../../Models/Property/property';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../Services/Property-Service/property.service';
import { PropertyFilterDto } from '../../Models/Property/property-filter.dto';
import { SavedPropertyService } from '../../Services/SavedProperty-Service/saved-property.service';
import { AuthService } from '../../Services/Auth-Service/auth-service';

@Component({
  selector: 'app-listingproperties',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listingproperties.html',
  styleUrls: ['./listingproperties.css'],
})
export class Listingproperties implements OnInit {
  properties: Property[] = [];
  isLoading = false;
  errorMessage = '';
  locationSearch: string = '';

  // Pagination metadata
  totalCount = 0;
  pageNumber = 1;
  pageSize = 20;
  totalPages = 0;

  // Track saved property IDs
  savedPropertyIds = new Set<number>();

  constructor(
    private propertyService: PropertyService,
    private savedPropertyService: SavedPropertyService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProperties();
    this.loadSavedPropertyIds();
  }

  loadProperties() {
    this.isLoading = true;
    this.errorMessage = '';

    // If searching, try to fetch more items to filter client-side
    // This is a workaround since backend search appears to be unstable
    const useClientSideSearch = !!this.locationSearch && this.locationSearch.trim().length > 0;

    const filter: PropertyFilterDto = {
      status: 1, // Active properties only
      pageNumber: useClientSideSearch ? 1 : this.pageNumber,
      pageSize: useClientSideSearch ? 100 : this.pageSize, // Fetch more if searching
      sortBy: 'CreatedAt',
      sortDescending: true
      // searchTerm: Removed to rely on client-side filtering
    };

    console.log('🏠 Loading properties from API... Mode:', useClientSideSearch ? 'Client Search' : 'Normal');

    this.propertyService.getProperties(filter).subscribe({
      next: (response) => {
        console.log('✅ Properties loaded successfully:', response);
        if (response && response.items) {
          let items = response.items;

          // Client-side filtering
          if (useClientSideSearch) {
            const searchTerm = this.locationSearch.toLowerCase().trim();
            items = items.filter(p =>
              (p.location && p.location.toLowerCase().includes(searchTerm)) ||
              (p.city && p.city.toLowerCase().includes(searchTerm)) ||
              (p.district && p.district.toLowerCase().includes(searchTerm)) ||
              (p.projectName && p.projectName.toLowerCase().includes(searchTerm))
            );
          }

          this.properties = items.sort((a, b) => {
            const priority: { [key: string]: number } = { 'Premium': 0, 'Featured': 1, 'Standard': 2 };
            return (priority[a.adType || 'Standard'] || 2) - (priority[b.adType || 'Standard'] || 2);
          });

          this.totalCount = useClientSideSearch ? items.length : response.totalCount;
          this.pageNumber = response.pageNumber;
          this.pageSize = response.pageSize;
          this.totalPages = useClientSideSearch ? 1 : response.totalPages; // Simplified for client search
        } else {
          this.properties = [];
        }
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

  /**
   * Load saved property IDs for the current user
   */
  loadSavedPropertyIds() {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.savedPropertyService.getMySavedProperties().subscribe({
      next: (savedProperties) => {
        this.savedPropertyIds = new Set(savedProperties.map(sp => sp.property.id));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load saved properties:', error);
      }
    });
  }

  /**
   * Check if a property is saved
   */
  isPropertySaved(propertyId: number): boolean {
    return this.savedPropertyIds.has(propertyId);
  }

  /**
   * Toggle save/unsave a property
   */
  toggleSave(event: Event, propertyId: number) {
    event.stopPropagation(); // Prevent navigation to property view
    event.preventDefault();

    if (!this.authService.isLoggedIn()) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }

    this.savedPropertyService.toggleSaveProperty(propertyId).subscribe({
      next: (response) => {
        if (response.isSaved) {
          this.savedPropertyIds.add(propertyId);
        } else {
          this.savedPropertyIds.delete(propertyId);
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to toggle save:', error);
      }
    });
  }
}

