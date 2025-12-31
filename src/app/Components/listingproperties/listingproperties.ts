import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Property } from '../../Models/Property/property';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../Services/Property-Service/property.service';
import { PropertyFilterDto } from '../../Models/Property/property-filter.dto';
import { SavedPropertyService } from '../../Services/SavedProperty-Service/saved-property.service';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LookupService } from '../../Services/Lookup-Service/lookup.service';
import { CityDto, DistrictDto, PropertyTypeDto } from '../../Models/Lookups/lookup.models';

@Component({
  selector: 'app-listingproperties',
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
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

  // Filters
  selectedCityId: number | null = null;
  selectedDistrictId: number | null = null;
  selectedPropertyTypeId: number | null = null;
  selectedPurpose: number | null = null; // 1=Sale, 2=Rent, 3=Both
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Lookups
  cities: CityDto[] = [];
  districts: DistrictDto[] = [];
  propertyTypes: PropertyTypeDto[] = [];
  isLoadingLookups = false;

  // Current language
  currentLang: string = 'ar';

  constructor(
    private propertyService: PropertyService,
    private savedPropertyService: SavedPropertyService,
    public authService: AuthService,
    private lookupService: LookupService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'ar';
    
    // Subscribe to language changes
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.cdr.detectChanges();
    });

    this.loadLookups();
    this.loadProperties();
    this.loadSavedPropertyIds();
  }

  // ==================== Lookups ====================

  loadLookups() {
    this.isLoadingLookups = true;
    
    // Load cities
    this.lookupService.getAllCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading cities:', err)
    });

    // Load property types
    this.lookupService.getAllPropertyTypes().subscribe({
      next: (types) => {
        this.propertyTypes = types;
        this.isLoadingLookups = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading property types:', err);
        this.isLoadingLookups = false;
      }
    });
  }

  onCityChange() {
    // Reset district when city changes
    this.selectedDistrictId = null;
    this.districts = [];

    if (this.selectedCityId) {
      this.lookupService.getDistrictsByCityId(this.selectedCityId).subscribe({
        next: (districts) => {
          this.districts = districts;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading districts:', err)
      });
    }
  }

  // ==================== Properties ====================

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

    // Apply filters
    if (this.selectedCityId) {
      filter.cityId = this.selectedCityId;
    }
    if (this.selectedDistrictId) {
      filter.districtId = this.selectedDistrictId;
    }
    if (this.selectedPropertyTypeId) {
      filter.propertyTypeId = this.selectedPropertyTypeId;
    }
    if (this.selectedPurpose) {
      filter.purpose = this.selectedPurpose;
    }
    if (this.minPrice) {
      filter.minPrice = this.minPrice;
    }
    if (this.maxPrice) {
      filter.maxPrice = this.maxPrice;
    }
    if (this.locationSearch && this.locationSearch.trim()) {
      filter.searchTerm = this.locationSearch.trim();
    }

    console.log('🏠 Loading properties with filters:', filter);

    this.propertyService.getProperties(filter).subscribe({
      next: (response) => {
        console.log('✅ Properties loaded successfully:', response);
        if (response && response.items) {
          // Sort by featured first
          this.properties = response.items.sort((a, b) => {
            const priority: { [key: string]: number } = { 'Premium': 0, 'Featured': 1, 'Standard': 2 };
            return (priority[a.adType || 'Standard'] || 2) - (priority[b.adType || 'Standard'] || 2);
          });

          this.totalCount = response.totalCount;
          this.pageNumber = response.pageNumber;
          this.pageSize = response.pageSize;
          this.totalPages = response.totalPages;
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

  // ==================== Search & Filters ====================

  applyFilters() {
    this.pageNumber = 1; // Reset to first page
    this.loadProperties();
  }

  clearFilters() {
    this.locationSearch = '';
    this.selectedCityId = null;
    this.selectedDistrictId = null;
    this.selectedPropertyTypeId = null;
    this.selectedPurpose = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.districts = [];
    this.pageNumber = 1;
    this.loadProperties();
  }

  // ==================== Language-Aware Getters ====================

  getPropertyTitle(prop: Property): string {
    if (this.currentLang === 'en') {
      return prop.titleEn || prop.title;
    }
    return prop.title;
  }

  getPropertyType(prop: Property): string {
    if (this.currentLang === 'en') {
      return prop.propertyTypeEn || prop.propertyType;
    }
    return prop.propertyType;
  }

  getPropertyLocation(prop: Property): string {
    if (this.currentLang === 'en') {
      return prop.locationEn || prop.location;
    }
    return prop.location;
  }

  getCityName(city: CityDto): string {
    if (this.currentLang === 'en' && city.nameEn) {
      return city.nameEn;
    }
    return city.name;
  }

  getDistrictName(district: DistrictDto): string {
    if (this.currentLang === 'en' && district.nameEn) {
      return district.nameEn;
    }
    return district.name;
  }

  getPropertyTypeName(type: PropertyTypeDto): string {
    if (this.currentLang === 'en' && type.nameEn) {
      return type.nameEn;
    }
    return type.name;
  }

  getPurposeLabel(prop: Property): string {
    if (prop.purpose === 'ForRent' || prop.purpose === 'Rent') {
      return this.translate.instant('LISTING_PROPERTIES.FOR_RENT');
    } else if (prop.purpose === 'Both') {
      return this.translate.instant('LISTING_PROPERTIES.FOR_BOTH');
    }
    return this.translate.instant('LISTING_PROPERTIES.FOR_SALE');
  }

  // ==================== Saved Properties ====================

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

  isPropertySaved(propertyId: number): boolean {
    return this.savedPropertyIds.has(propertyId);
  }

  toggleSave(event: Event, propertyId: number) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isLoggedIn()) {
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

  // ==================== Pagination ====================

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.loadProperties();
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadProperties();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadProperties();
    }
  }
}
