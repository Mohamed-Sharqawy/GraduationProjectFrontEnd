import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../../Services/Agent-Service/agent.service';
import { AgentProfileDto } from '../../Models/Agent/agent-profile.dto';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { decodeAgentId } from '../../utils/agent-id.utils';

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './agent-profile.html',
  styleUrl: './agent-profile.css',
})
export class AgentProfile implements OnInit {
  agentId: string | null = null;
  agent: AgentProfileDto | null = null;
  isLoading: boolean = true;
  filteredProperties: any[] = [];
  locationSearch: string = '';

  constructor(
    private route: ActivatedRoute,
    private agentsService: AgentService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  // Current language
  currentLang: string = 'ar';

  ngOnInit() {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'ar';
    
    // Subscribe to language changes
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.cdr.detectChanges();
    });

    const encodedId = this.route.snapshot.paramMap.get('id');
    if (encodedId) {
      try {
        // Decode Base64 to get actual GUID
        this.agentId = decodeAgentId(encodedId);
        this.getAgentData(this.agentId);
      } catch (error) {
        console.error('Invalid agent ID format', error);
      }
    }
  }

  getAgentData(id: string) {
    this.isLoading = true;
    this.agentsService.getAgentProfile(id).subscribe({
      next: (data) => {
        this.agent = data;
        // Filter to show ONLY active properties
        const allProperties = data.properties || [];
        this.filteredProperties = allProperties.filter(prop => prop.status === 'Active');
        this.isLoading = false;
        console.log('Agent Data:', this.agent);
        console.log('Active Properties:', this.filteredProperties);
        this.cdr.detectChanges(); // Force change detection
      },
      error: (err) => {
        console.error('Error fetching agent data:', err);
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  filterProperties() {
    if (!this.agent || !this.agent.properties) return;

    // Start with ACTIVE properties only
    let activeProperties = this.agent.properties.filter(prop => prop.status === 'Active');

    if (!this.locationSearch) {
      this.filteredProperties = activeProperties;
    } else {
      const search = this.locationSearch.toLowerCase();
      this.filteredProperties = activeProperties.filter(prop =>
        (this.getPropertyLocation(prop).toLowerCase().includes(search)) ||
        (this.getPropertyTitle(prop).toLowerCase().includes(search))
      );
    }
  }

  openEmail(email: string) {
    if (email) window.location.href = `mailto:${email}`;
  }

  openCall(phone: string) {
    if (phone) window.location.href = `tel:${phone}`;
  }

  openWhatsApp(number: string) {
    if (number) window.open(`https://wa.me/${number}`, '_blank');
  }

  // Helper methods for localization
  getPropertyTitle(prop: any): string {
    if (this.currentLang === 'en') {
      return prop.titleEn || prop.title;
    }
    return prop.title;
  }

    getPropertyLocation(prop: any): string {
    // Debug log
    // console.log(`Lang: ${this.currentLang}, CityEn: ${prop.cityEn}, DistEn: ${prop.districtEn}`);

    if (this.currentLang === 'en') {
      // English Mode
      const city = prop.cityEn || prop.city;
      // Use DistrictEn if available, otherwise DO NOT fallback to Arabic District
      const district = prop.districtEn;
      
      if (district && city) {
        return `${district}, ${city}`;
      }
      return city || '';
    }
    // Arabic Mode
    const city = prop.city;
    const district = prop.district;
    if (district && city) {
      return `${district}, ${city}`;
    }
    return city || '';
  }

  getPropertyType(prop: any): string {
    if (this.currentLang === 'en') {
      return prop.propertyTypeEn || prop.propertyType;
    }
    return prop.propertyType;
  }
}
