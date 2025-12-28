import { Component, OnInit, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyCardDto, CreatePropertyDto, PropertyDetailsDto } from '../../Models/Property/PropertyDtos';
import { PropertyService } from '../../Services/Property-Service/property.service';
import { AuthService } from '../../Services/Auth-Service/auth-service';

@Component({
    selector: 'app-user-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './userdashboard.html',
    styleUrl: './userdashboard.css'
})
export class UserDashboard {
    userProperties: PropertyCardDto[] = [];
    isFormVisible = false;
    isEditing = false;
    isLoading = false;
    errorMessage: string | null = null;
    needsLogin = false; // New flag for login state

    // Form Data
    currentProperty: any = {};
    selectedFiles: File[] = [];

    // Filter
    filter: any = {
        PageNumber: 1,
        PageSize: 100
    };

    constructor(
        private propertiesService: PropertyService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private authService: AuthService
    ) {
        afterNextRender(() => {
            console.log('🔄 UserDashboard: afterNextRender triggered');
            setTimeout(() => {
                this.loadProperties();
            }, 0);
        });
    }

    loadProperties() {
        console.log('📡 UserDashboard: Loading properties...');

        // Check authentication FIRST
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

                // Handle 401 specifically
                if (err.status === 401) {
                    this.needsLogin = true;
                    this.errorMessage = 'Session expired. Please log in again.';
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
        this.currentProperty = {
            Title: '',
            Description: '',
            Price: null,
            CityId: 1, // Default to Cairo or select
            PropertyTypeId: 1, // Default
            Purpose: 0, // Sale
            Status: 1, // Active
            Rooms: 0,
            Bathrooms: 0,
            Area: 0,
            IsFeatured: false,
            PrimaryImageIndex: 0,
            IsAgricultural: false // Default
        };
        this.isFormVisible = true;
    }

    editProperty(id: number) {
        this.isEditing = true;
        this.selectedFiles = []; // Reset files on edit

        // Fetch full details
        this.propertiesService.getProperty(id).subscribe({
            next: (details: PropertyDetailsDto) => {
                this.currentProperty = {
                    id: details.id,
                    Title: details.title,
                    Description: details.description,
                    Price: details.price,
                    RentPriceMonthly: details.rentPriceMonthly,
                    CityId: details.cityId,
                    DistrictId: details.districtId,
                    ProjectId: details.projectId,
                    AddressDetails: details.addressDetails,
                    PropertyTypeId: details.propertyTypeId,
                    Purpose: details.purpose === 'For Sale' ? 0 : 1, // Simple mapping, refine if needed based on enum
                    Status: 1, // details.status is string, need mapping if used in update
                    Rooms: details.rooms,
                    Bathrooms: details.bathrooms,
                    Area: details.area,
                    FloorNumber: details.floorNumber,
                    IsFeatured: details.isFeatured,
                    IsAgricultural: details.isAgricultural,
                    PrimaryImageIndex: 0
                };
                // Note: handling existing images for update needs more UI logic (delete existing, add new). 
                // For MVP, we might only allow adding new images or basic update.
                this.isFormVisible = true;
            },
            error: (err) => console.error('Error fetching property details', err)
        });
    }

    deleteProperty(id: number) {
        if (confirm('Are you sure you want to delete this property?')) {
            this.propertiesService.deleteProperty(id).subscribe({
                next: () => {
                    this.userProperties = this.userProperties.filter(p => p.id !== id);
                    alert('Property deleted successfully');
                },
                error: (err) => {
                    console.error('Error deleting property', err);
                    alert('Failed to delete property');
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
        const formData = new FormData();

        // Append basic fields
        for (const key in this.currentProperty) {
            if (this.currentProperty[key] !== null && this.currentProperty[key] !== undefined && key !== 'id') {
                formData.append(key, this.currentProperty[key].toString());
            }
        }

        // Append Images
        this.selectedFiles.forEach((file) => {
            formData.append('Images', file, file.name);
        });

        if (this.isEditing) {
            this.propertiesService.updateProperty(this.currentProperty.id, formData).subscribe({
                next: (res) => {
                    alert('Property updated successfully');
                    this.closeForm();
                    this.loadProperties();
                },
                error: (err) => {
                    console.error('Error updating property', err);
                    alert('Failed to update property: ' + (err.error?.message || err.message));
                }
            });
        } else {
            this.propertiesService.createProperty(formData).subscribe({
                next: (res) => {
                    alert('Property created successfully');
                    this.closeForm();
                    this.loadProperties();
                },
                error: (err) => {
                    console.error('Error creating property', err);
                    alert('Failed to create property: ' + (err.error?.message || err.message));
                }
            });
        }
    }

    cancel() {
        this.closeForm();
    }

    private closeForm() {
        this.isFormVisible = false;
        this.currentProperty = {};
        this.selectedFiles = [];
    }
}
