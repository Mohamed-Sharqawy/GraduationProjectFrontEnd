# Lookups API Integration

## Overview
This document describes the new Lookups API endpoints integrated into the Angular frontend.

## Available Endpoints

### Cities
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lookups/cities` | Get all cities |
| `GET` | `/api/lookups/cities/{id}` | Get city by ID |

### Districts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lookups/districts` | Get all districts |
| `GET` | `/api/lookups/districts/{id}` | Get district by ID |
| `GET` | `/api/lookups/cities/{cityId}/districts` | Get districts by city ID |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lookups/projects` | Get all projects |
| `GET` | `/api/lookups/projects/{id}` | Get project by ID |

### Property Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lookups/property-types` | Get all property types |
| `GET` | `/api/lookups/property-types/{id}` | Get property type by ID |

### Property Images
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lookups/properties/{propertyId}/images` | Get all images for a property |

## Files Added

### Models
- `src/app/Models/Lookups/lookup.models.ts` - DTOs for all lookup types
- `src/app/Models/Lookups/index.ts` - Export file

### Services
- `src/app/Services/Lookup-Service/lookup.service.ts` - Lookup service with all API methods
- `src/app/Services/Lookup-Service/index.ts` - Export file

### Configuration
- `src/environments/api.config.ts` - Added lookups endpoints

## Usage Examples

### Import the Service
```typescript
import { LookupService } from './Services/Lookup-Service';
// or
import { LookupService } from './Services/Lookup-Service/lookup.service';
```

### Import the Models
```typescript
import { CityDto, DistrictDto, ProjectDto, PropertyTypeDto, PropertyImageDto } from './Models/Lookups';
// or
import { CityDto } from './Models/Lookups/lookup.models';
```

### In a Component

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { LookupService } from '../../Services/Lookup-Service';
import { CityDto, DistrictDto, PropertyTypeDto, ProjectDto } from '../../Models/Lookups';

@Component({
  selector: 'app-property-filter',
  templateUrl: './property-filter.component.html'
})
export class PropertyFilterComponent implements OnInit {
  private lookupService = inject(LookupService);
  
  cities: CityDto[] = [];
  districts: DistrictDto[] = [];
  propertyTypes: PropertyTypeDto[] = [];
  projects: ProjectDto[] = [];
  
  selectedCityId: number | null = null;

  ngOnInit() {
    this.loadCities();
    this.loadPropertyTypes();
    this.loadProjects();
  }

  loadCities() {
    this.lookupService.getAllCities().subscribe({
      next: (cities) => this.cities = cities,
      error: (err) => console.error('Error loading cities:', err)
    });
  }

  onCityChange(cityId: number) {
    this.selectedCityId = cityId;
    // Load districts for selected city
    this.lookupService.getDistrictsByCityId(cityId).subscribe({
      next: (districts) => this.districts = districts,
      error: (err) => console.error('Error loading districts:', err)
    });
  }

  loadPropertyTypes() {
    this.lookupService.getAllPropertyTypes().subscribe({
      next: (types) => this.propertyTypes = types,
      error: (err) => console.error('Error loading property types:', err)
    });
  }

  loadProjects() {
    this.lookupService.getAllProjects().subscribe({
      next: (projects) => this.projects = projects,
      error: (err) => console.error('Error loading projects:', err)
    });
  }
}
```

### Template Example

```html
<!-- City Dropdown -->
<select (change)="onCityChange($event.target.value)">
  <option value="">Select City</option>
  <option *ngFor="let city of cities" [value]="city.id">
    {{ city.name }} ({{ city.districtsCount }} districts)
  </option>
</select>

<!-- District Dropdown (filtered by city) -->
<select>
  <option value="">Select District</option>
  <option *ngFor="let district of districts" [value]="district.id">
    {{ district.name }}
  </option>
</select>

<!-- Property Type Dropdown -->
<select>
  <option value="">Select Property Type</option>
  <option *ngFor="let type of propertyTypes" [value]="type.id">
    {{ type.name }} ({{ type.propertiesCount }} properties)
  </option>
</select>

<!-- Projects Dropdown -->
<select>
  <option value="">Select Project</option>
  <option *ngFor="let project of projects" [value]="project.id">
    {{ project.name }} - {{ project.cityName }}
  </option>
</select>
```

## Response Examples

### City Response
```json
{
  "id": 1,
  "name": "القاهرة",
  "nameEn": "Cairo",
  "districtsCount": 15,
  "propertiesCount": 120
}
```

### District Response
```json
{
  "id": 1,
  "name": "المعادي",
  "nameEn": "Maadi",
  "cityId": 1,
  "cityName": "القاهرة",
  "propertiesCount": 45
}
```

### Project Response
```json
{
  "id": 1,
  "name": "كمبوند مدينتي",
  "nameEn": "Madinaty Compound",
  "logoUrl": "https://...",
  "coverImageUrl": "https://...",
  "cityId": 1,
  "cityName": "القاهرة",
  "districtId": 5,
  "districtName": "التجمع الخامس",
  "locationDescription": "طريق السويس",
  "isActive": true,
  "propertiesCount": 250,
  "minPrice": 1500000,
  "minArea": 80,
  "maxArea": 350
}
```

### Property Type Response
```json
{
  "id": 1,
  "name": "شقة",
  "nameEn": "Apartment",
  "iconUrl": "https://...",
  "propertiesCount": 500
}
```

### Property Images Response
```json
[
  {
    "id": 1,
    "propertyId": 5,
    "imageUrl": "https://cloudinary.com/...",
    "isMain": true,
    "isPrimary": true,
    "sortOrder": 0
  },
  {
    "id": 2,
    "propertyId": 5,
    "imageUrl": "https://cloudinary.com/...",
    "isMain": false,
    "isPrimary": false,
    "sortOrder": 1
  }
]
```

## Notes
- All endpoints are public (no authentication required)
- The service is provided in root, so no need to add it to providers
- Remember to deploy the backend API changes before using these endpoints
