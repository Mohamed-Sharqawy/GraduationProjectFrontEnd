import { Component, OnInit, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyCardDto, CreatePropertyDto, PropertyDetailsDto } from '../../Models/Property/PropertyDtos';
import { PropertyService } from '../../Services/Property-Service/property.service';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LookupService } from '../../Services/Lookup-Service/lookup.service';
import { CityDto, DistrictDto, ProjectDto, PropertyTypeDto } from '../../Models/Lookups/lookup.models';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-user-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './userdashboard.html',
    styleUrl: './userdashboard.css'
})
export class UserDashboard {
    userProperties: PropertyCardDto[] = [];
    isFormVisible = false;
    isEditing = false;
    isLoading = false;
    isSaving = false; // Prevent double submissions
    errorMessage: string | null = null;
    needsLogin = false;

    // Form Data
    currentProperty: any = {};
    selectedFiles: File[] = [];

    // Filter
    filter: any = {
        PageNumber: 1,
        PageSize: 100
    };

    // Lookups from API
    cities: CityDto[] = [];
    filteredCities: CityDto[] = [];
    citySearchTerm: string = '';

    districts: DistrictDto[] = [];
    filteredDistricts: DistrictDto[] = [];
    districtSearchTerm: string = '';

    projects: ProjectDto[] = [];
    filteredProjects: ProjectDto[] = [];
    projectSearchTerm: string = '';

    propertyTypes: PropertyTypeDto[] = [];
    filteredPropertyTypes: PropertyTypeDto[] = [];
    propertyTypeSearchTerm: string = '';

    // Loading states for lookups
    isLoadingCities = false;
    isLoadingDistricts = false;
    isLoadingProjects = false;
    isLoadingPropertyTypes = false;

    constructor(
        private propertiesService: PropertyService,
        private lookupService: LookupService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private authService: AuthService,
        private translate: TranslateService,
        private toastr: ToastrService
    ) {
        afterNextRender(() => {
            console.log('🔄 UserDashboard: afterNextRender triggered');
            setTimeout(() => {
                this.loadProperties();
                this.loadLookups();
            }, 0);
        });
    }

    // ==================== Load Lookups ====================

    loadLookups() {
        this.loadCities();
        this.loadPropertyTypes();
        this.loadAllProjects();
    }

    loadCities() {
        this.isLoadingCities = true;
        this.lookupService.getAllCities().subscribe({
            next: (cities) => {
                this.cities = cities;
                this.filteredCities = cities;
                this.isLoadingCities = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading cities:', err);
                this.isLoadingCities = false;
            }
        });
    }

    loadPropertyTypes() {
        this.isLoadingPropertyTypes = true;
        this.lookupService.getAllPropertyTypes().subscribe({
            next: (types) => {
                this.propertyTypes = types;
                this.filteredPropertyTypes = types;
                this.isLoadingPropertyTypes = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading property types:', err);
                this.isLoadingPropertyTypes = false;
            }
        });
    }

    loadAllProjects() {
        this.isLoadingProjects = true;
        this.lookupService.getAllProjects().subscribe({
            next: (projects) => {
                this.projects = projects;
                this.filteredProjects = projects;
                this.isLoadingProjects = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading projects:', err);
                this.isLoadingProjects = false;
            }
        });
    }

    // ==================== City Change Handler ====================

    onCityChange(cityId: number) {
        // Convert to number in case it comes as string from select
        const numericCityId = cityId ? Number(cityId) : null;
        console.log('🏙️ City changed to:', numericCityId);
        
        // Reset district and project
        this.currentProperty.DistrictId = null;
        this.currentProperty.ProjectId = null;
        this.districts = [];
        this.filteredDistricts = [];
        this.districtSearchTerm = '';
        this.projectSearchTerm = '';

        if (numericCityId) {
            // Load districts for selected city
            this.isLoadingDistricts = true;
            this.lookupService.getDistrictsByCityId(numericCityId).subscribe({
                next: (districts) => {
                    this.districts = districts;
                    this.filteredDistricts = districts;
                    this.isLoadingDistricts = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Error loading districts:', err);
                    this.isLoadingDistricts = false;
                }
            });

            // Filter projects by city - show all projects that belong to this city
            this.filteredProjects = this.projects.filter(p => Number(p.cityId) === numericCityId);
            console.log('📦 Filtered projects for city:', this.filteredProjects.length, this.filteredProjects);
        } else {
            this.filteredProjects = this.projects;
        }
        this.cdr.detectChanges();
    }

    // ==================== District Change Handler ====================

    onDistrictChange(districtId: number) {
        // Convert to number in case it comes as string from select
        const numericDistrictId = districtId ? Number(districtId) : null;
        console.log('🏘️ District changed to:', numericDistrictId);
        
        // Reset project
        this.currentProperty.ProjectId = null;
        this.projectSearchTerm = '';

        const cityId = this.currentProperty.CityId;
        const numericCityId = cityId ? Number(cityId) : null;

        if (numericDistrictId) {
            // Filter projects: show projects that belong to this district, 
            // OR projects that belong to the city but don't have a specific district
            this.filteredProjects = this.projects.filter(p => 
                Number(p.districtId) === numericDistrictId || 
                (Number(p.cityId) === numericCityId && !p.districtId)
            );
            console.log('📦 Filtered projects for district:', this.filteredProjects.length, this.filteredProjects);
        } else if (numericCityId) {
            // If no district selected, show all projects in the city
            this.filteredProjects = this.projects.filter(p => Number(p.cityId) === numericCityId);
            console.log('📦 Filtered projects for city (no district):', this.filteredProjects.length, this.filteredProjects);
        } else {
            this.filteredProjects = this.projects;
        }
        this.cdr.detectChanges();
    }

    // ==================== Search Filters ====================

    filterCities() {
        const term = this.citySearchTerm.toLowerCase().trim();
        if (!term) {
            this.filteredCities = this.cities;
        } else {
            this.filteredCities = this.cities.filter(c => 
                c.name.toLowerCase().includes(term) || 
                (c.nameEn && c.nameEn.toLowerCase().includes(term))
            );
        }
    }

    filterDistricts() {
        const term = this.districtSearchTerm.toLowerCase().trim();
        if (!term) {
            this.filteredDistricts = this.districts;
        } else {
            this.filteredDistricts = this.districts.filter(d => 
                d.name.toLowerCase().includes(term) || 
                (d.nameEn && d.nameEn.toLowerCase().includes(term))
            );
        }
    }

    filterProjects() {
        const term = this.projectSearchTerm.toLowerCase().trim();
        const cityId = this.currentProperty.CityId;
        
        let baseProjects = cityId ? this.projects.filter(p => p.cityId === cityId) : this.projects;
        
        if (!term) {
            this.filteredProjects = baseProjects;
        } else {
            this.filteredProjects = baseProjects.filter(p => 
                p.name.toLowerCase().includes(term) || 
                (p.nameEn && p.nameEn.toLowerCase().includes(term))
            );
        }
    }

    filterPropertyTypes() {
        const term = this.propertyTypeSearchTerm.toLowerCase().trim();
        if (!term) {
            this.filteredPropertyTypes = this.propertyTypes;
        } else {
            this.filteredPropertyTypes = this.propertyTypes.filter(t => 
                t.name.toLowerCase().includes(term) || 
                (t.nameEn && t.nameEn.toLowerCase().includes(term))
            );
        }
    }

    // ==================== Properties CRUD ====================

    loadProperties() {
        console.log('📡 UserDashboard: Loading properties...');

        const token = this.authService.token;
        console.log('🔑 Token exists:', !!token);

        if (!token) {
            console.log('🚫 No token found, showing login prompt');
            this.needsLogin = true;
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;
        this.needsLogin = false;

        this.propertiesService.getMyProperties(this.filter).subscribe({
            next: (response) => {
                console.log('✅ UserDashboard: Properties loaded', response);
                this.userProperties = response.items;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('❌ UserDashboard: Error loading properties', err);
                this.isLoading = false;

                if (err.status === 401) {
                    this.needsLogin = true;
                    this.errorMessage = this.translate.instant('USER_DASHBOARD.SESSION_EXPIRED');
                } else {
                    this.errorMessage = 'Failed to load properties. ' + (err.error?.message || err.message || 'Unknown error');
                }
                this.cdr.detectChanges();
            }
        });
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

    addProperty() {
        this.isEditing = false;
        this.selectedFiles = [];
        this.districtSearchTerm = '';
        this.projectSearchTerm = '';
        this.districts = [];
        this.filteredDistricts = [];
        this.filteredProjects = this.projects;
        
        // Initialize with default values matching the request payload structure
        this.currentProperty = {
            Title: '',
            Description: '',
            TitleEn: '',
            DescriptionEn: '',
            CityId: null,
            DistrictId: null,
            ProjectId: null,
            AddressDetails: '',
            AddressDetailsEn: '',
            PropertyTypeId: null,
            Purpose: 1, // Sale by default
            Price: null,
            RentPriceMonthly: null,
            Rooms: 0,
            Bathrooms: 0,
            Area: 0,
            FinishingType: 0,
            FloorNumber: null,
            IsFeatured: false,
            IsAgricultural: false,
            PrimaryImageIndex: 0
        };
        this.isFormVisible = true;
    }

    editProperty(id: number) {
        this.isEditing = true;
        this.selectedFiles = [];

        this.propertiesService.getProperty(id).subscribe({
            next: (details: PropertyDetailsDto) => {
                // Determine Purpose ID from string or enum
                let purposeId = 1; // Default Sale
                if (details.purpose === 'For Rent' || details.purpose === 'Rent') purposeId = 2;
                else if (details.purpose === 'For Both' || details.purpose === 'Both') purposeId = 3;

                // Match Finishing Type (Basic mapping, adjust based on backend strings)
                let finishingId = 0;
                // If backend sends text, we might need a mapping here. 
                // For now assuming 0 if not matched or if it comes as int.

                this.currentProperty = {
                    id: details.id,
                    Title: details.title,
                    TitleEn: details.title, // Fallback if En not provided in DTO
                    Description: details.description,
                    DescriptionEn: details.description, // Fallback
                    Price: details.price,
                    RentPriceMonthly: details.rentPriceMonthly,
                    CityId: details.cityId,
                    DistrictId: details.districtId,
                    ProjectId: details.projectId,
                    AddressDetails: details.addressDetails,
                    AddressDetailsEn: details.addressDetails, // Fallback
                    PropertyTypeId: details.propertyTypeId,
                    Purpose: purposeId,
                    Rooms: details.rooms,
                    Bathrooms: details.bathrooms,
                    Area: details.area,
                    FloorNumber: details.floorNumber,
                    FinishingType: 0, // Needs mapping from details.finishingType if string
                    IsFeatured: details.isFeatured,
                    IsAgricultural: details.isAgricultural,
                    PrimaryImageIndex: 0
                };
                
                // Load districts for the city
                if (details.cityId) {
                    // Start loading districts but don't reset values immediately
                    this.isLoadingDistricts = true;
                    this.lookupService.getDistrictsByCityId(details.cityId).subscribe({
                        next: (districts) => {
                            this.districts = districts;
                            this.filteredDistricts = districts;
                            this.isLoadingDistricts = false;
                            
                            // Apply filtering for projects based on loaded districts and existing selection
                            this.filteredProjects = this.projects.filter(p => p.cityId === details.cityId);
                            // If district is selected, refine project filter
                            if (details.districtId) {
                                this.onDistrictChange(details.districtId);
                            }
                            this.cdr.detectChanges();
                        },
                        error: (err) => {
                            console.error('Error loading districts:', err);
                            this.isLoadingDistricts = false;
                        }
                    });
                }
                
                this.isFormVisible = true;
            },
            error: (err) => console.error('Error fetching property details', err)
        });
    }

    deleteProperty(id: number) {
        if (confirm(this.translate.instant('USER_DASHBOARD.CONFIRM_DELETE'))) {
            this.propertiesService.deleteProperty(id).subscribe({
                next: () => {
                    this.userProperties = this.userProperties.filter(p => p.id !== id);
                    alert(this.translate.instant('USER_DASHBOARD.DELETE_SUCCESS'));
                },
                error: (err) => {
                    console.error('Error deleting property', err);
                    alert(this.translate.instant('USER_DASHBOARD.DELETE_FAIL'));
                }
            });
        }
    }

    onFileSelect(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedFiles = Array.from(event.target.files);
        }
    }

    saveProperty() {
        // Prevent double submissions
        if (this.isSaving) {
            console.log('⚠️ Save already in progress, ignoring click');
            return;
        }

        this.isSaving = true;
        const formData = new FormData();

        // 1. Append all basic fields
        for (const key in this.currentProperty) {
            // Check for valid values (allow false/0 but skip null/undefined)
            const value = this.currentProperty[key];
            if (value !== null && value !== undefined && key !== 'id') {
                formData.append(key, value.toString());
            }
        }

        // 2. Handle nulls for optional fields if needed explicitly by backend
        // Ensure RentPriceMonthly is sent if Purpose is Rent/Both
        const purpose = Number(this.currentProperty.Purpose);
        if (purpose === 2 || purpose === 3) {
            if (!this.currentProperty.RentPriceMonthly) {
                // If user didn't enter rent price, send 0
                if (!formData.has('RentPriceMonthly')) formData.append('RentPriceMonthly', '0');
            }
        }

        // 3. Append Images
        this.selectedFiles.forEach((file) => {
            formData.append('Images', file, file.name);
        });

        if (this.isEditing) {
            this.propertiesService.updateProperty(this.currentProperty.id, formData).subscribe({
                next: (res) => {
                    this.isSaving = false;
                    this.toastr.success(
                        this.translate.instant('USER_DASHBOARD.UPDATE_SUCCESS'),
                        this.translate.instant('COMMON.SUCCESS') || 'Success'
                    );
                    this.closeForm();
                    this.loadProperties();
                },
                error: (err) => {
                    this.isSaving = false;
                    console.error('Error updating property', err);
                    this.toastr.error(
                        (err.error?.message || err.message || this.translate.instant('USER_DASHBOARD.UPDATE_FAIL')),
                        this.translate.instant('COMMON.ERROR') || 'Error'
                    );
                }
            });
        } else {
            this.propertiesService.createProperty(formData).subscribe({
                next: (res) => {
                    this.isSaving = false;
                    this.toastr.success(
                        this.translate.instant('USER_DASHBOARD.PROPERTY_PENDING_REVIEW') || 'تم إضافة إعلانك في انتظار المراجعة',
                        this.translate.instant('COMMON.SUCCESS') || 'Success'
                    );
                    this.closeForm();
                    this.loadProperties();
                },
                error: (err) => {
                    this.isSaving = false;
                    console.error('Error creating property', err);
                    this.toastr.error(
                        (err.error?.message || err.message || this.translate.instant('USER_DASHBOARD.CREATE_FAIL')),
                        this.translate.instant('COMMON.ERROR') || 'Error'
                    );
                }
            });
        }
    }

    cancel() {
        this.closeForm();
    }

    private closeForm() {
        this.isFormVisible = false;
        this.isSaving = false;
        this.currentProperty = {};
        this.selectedFiles = [];
        this.districtSearchTerm = '';
        this.projectSearchTerm = '';
    }
}

