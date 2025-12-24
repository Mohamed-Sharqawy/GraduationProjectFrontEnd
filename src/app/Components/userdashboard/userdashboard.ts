import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property } from '../../Models/Property/property';

@Component({
    selector: 'app-user-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './userdashboard.html',
    styleUrl: './userdashboard.css'
})
export class UserDashboard {
    // Dummy Data for demonstration
    userProperties: Property[] = [
        {
            id: 1,
            title: 'Modern Apartment in New Cairo',
            price: 3500000,
            rentPriceMonthly: 0,
            currency: 'EGP',
            location: 'New Cairo, Egypt',
            propertyType: 'Apartment',
            propertyTypeEn: 'Apartment',
            status: 'Ready',
            rooms: 3,
            bathrooms: 2,
            area: 145,
            mainImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3d272947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            isFeatured: false,
            city: 'Cairo',
            cityEn: 'Cairo',
            district: 'New Cairo',
            districtEn: 'New Cairo',
            projectName: 'The Address',
            purpose: 'For Sale',
            finishingType: 'Finished',
            viewCount: 150,
            createdAt: '2023-12-01',
            agentId: '1',
            agentName: 'John Doe',
            agentProfileImage: ''
        },
        {
            id: 2,
            title: 'Cozy Villa in Sheikh Zayed',
            price: 8200000,
            rentPriceMonthly: 0,
            currency: 'EGP',
            location: 'Sheikh Zayed, Giza',
            propertyType: 'Villa',
            propertyTypeEn: 'Villa',
            status: 'Off-Plan',
            rooms: 4,
            bathrooms: 3,
            area: 320,
            mainImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            isFeatured: true,
            city: 'Giza',
            cityEn: 'Giza',
            district: 'Sheikh Zayed',
            districtEn: 'Sheikh Zayed',
            projectName: 'Zayed Dunes',
            purpose: 'For Sale',
            finishingType: 'Semi-Finished',
            viewCount: 320,
            createdAt: '2023-12-10',
            agentId: '1',
            agentName: 'John Doe',
            agentProfileImage: ''
        }
    ];

    isFormVisible = false;
    isEditing = false;

    // Empty property for the form
    currentProperty: any = {};

    addProperty() {
        this.isEditing = false;
        this.currentProperty = {
            id: 0,
            currency: 'EGP',
            propertyType: 'Apartment',
            status: 'Ready',
            isFeatured: false,
            mainImageUrl: ''
        };
        this.isFormVisible = true;
    }

    editProperty(id: number) {
        this.isEditing = true;
        // Clone the object to avoid direct mutation before saving
        const propToEdit = this.userProperties.find(p => p.id === id);
        if (propToEdit) {
            this.currentProperty = { ...propToEdit };
            this.isFormVisible = true;
        }
    }

    deleteProperty(id: number) {
        if (confirm('Are you sure you want to delete this property?')) {
            this.userProperties = this.userProperties.filter(p => p.id !== id);
        }
    }

    saveProperty() {
        // Basic assignment for fields not in the simplified form
        if (!this.currentProperty.rooms) this.currentProperty.rooms = 0;
        if (!this.currentProperty.bathrooms) this.currentProperty.bathrooms = 0;
        if (!this.currentProperty.area) this.currentProperty.area = 0;
        if (!this.currentProperty.rentPriceMonthly) this.currentProperty.rentPriceMonthly = 0;
        if (!this.currentProperty.city) this.currentProperty.city = 'Cairo';
        if (!this.currentProperty.cityEn) this.currentProperty.cityEn = 'Cairo';
        if (!this.currentProperty.district) this.currentProperty.district = 'Maadi';
        if (!this.currentProperty.districtEn) this.currentProperty.districtEn = 'Maadi';
        if (!this.currentProperty.projectName) this.currentProperty.projectName = 'Project';
        if (!this.currentProperty.purpose) this.currentProperty.purpose = 'For Sale';
        if (!this.currentProperty.finishingType) this.currentProperty.finishingType = 'Finished';
        if (!this.currentProperty.viewCount) this.currentProperty.viewCount = 0;
        if (!this.currentProperty.createdAt) this.currentProperty.createdAt = new Date().toISOString();
        if (!this.currentProperty.agentId) this.currentProperty.agentId = '1';
        if (!this.currentProperty.agentName) this.currentProperty.agentName = 'User';
        if (!this.currentProperty.agentProfileImage) this.currentProperty.agentProfileImage = '';
        if (!this.currentProperty.propertyTypeEn) this.currentProperty.propertyTypeEn = this.currentProperty.propertyType;

        if (this.isEditing) {
            // Update existing
            const index = this.userProperties.findIndex(p => p.id === this.currentProperty.id);
            if (index !== -1) {
                this.userProperties[index] = { ...this.currentProperty } as Property;
            }
        } else {
            // Add new (generate a random ID for now)
            this.currentProperty.id = Math.floor(Math.random() * 10000);
            this.userProperties.push({ ...this.currentProperty } as Property);
        }
        this.closeForm();
    }

    cancel() {
        this.closeForm();
    }

    private closeForm() {
        this.isFormVisible = false;
        this.currentProperty = {};
    }
}
