import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SavedPropertyService } from '../../Services/SavedProperty-Service/saved-property.service';
import { SavedPropertyDto } from '../../Models/SavedProperty/saved-property.models';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-saved-properties',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './saved-properties.component.html',
    styleUrls: ['./saved-properties.component.css']
})
export class SavedPropertiesComponent implements OnInit {
    savedProperties: SavedPropertyDto[] = [];
    isLoading = false;

    private savedPropertyService = inject(SavedPropertyService);
    private toastr = inject(ToastrService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit() {
        this.loadSavedProperties();
    }

    loadSavedProperties() {
        this.isLoading = true;
        this.savedPropertyService.getMySavedProperties().subscribe({
            next: (properties) => {
                this.savedProperties = properties;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to load saved properties:', error);
                this.toastr.error('Failed to load saved properties', 'Error');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    unsaveProperty(propertyId: number) {
        this.savedPropertyService.unsaveProperty(propertyId).subscribe({
            next: () => {
                this.savedProperties = this.savedProperties.filter(sp => sp.property.id !== propertyId);
                this.toastr.success('Property removed from saved list', 'Success');
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to unsave property:', error);
                this.toastr.error('Failed to remove property', 'Error');
            }
        });
    }
}
