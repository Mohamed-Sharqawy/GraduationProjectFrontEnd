import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { PropertyService } from '../../Services/Property-Service/property.service';
import { AgentService } from '../../Services/Agent-Service/agent.service';
import { ChatbotService } from '../../Services/Chatbot-Service/chatbot.service';
import { PropertyDetailsDto } from '../../Models/Property/property-details.dto';
import { PropertyListItemDto } from '../../Models/Property/property-list-item.dto';
import { SavedPropertyService } from '../../Services/SavedProperty-Service/saved-property.service';
import { AuthService } from '../../Services/Auth-Service/auth-service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { encodeAgentId } from '../../utils/agent-id.utils';

@Component({
  selector: 'app-propertyview',
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './propertyview.html',
  styleUrl: './propertyview.css',
})
export class Propertyview implements OnInit {
  // Property Data
  property: PropertyDetailsDto | null = null;
  price = 0;
  currency = 'EGP';
  rentPriceMonthly = 0;
  installment = '0';
  installmentPeriod = '0 years';
  downPayment = '0';
  location = '';
  title = '';
  mainImageUrl = '';
  
  specs = {
    beds: 0,
    baths: 0,
    area: 0
  };

  // Analytics
  viewCount = 0;
  whatsappClickCount = 0;

  // Saved property state
  isSaved = false;
  propertyId: number | null = null;

  description: string[] = [];
  propertySpecs: { label: string; value: string }[] = [];

  // Agent data
  agent = {
    id: '',
    name: '',
    company: '',
    imageUrl: '',
    role: '',
    experience: '',
    activeListings: 0,
    email: '',
    phone: '',
    whatsapp: ''
  };

  // Similar Properties
  similarProperties: PropertyListItemDto[] = [];
  isLoadingSimilar = false;

  isLoading = true;
  errorMessage = '';

  // Current language
  currentLang: string = 'ar';

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private agentService: AgentService,
    private chatbotService: ChatbotService,
    private savedPropertyService: SavedPropertyService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get current language
    this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'ar';
    
    // Subscribe to language changes
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      this.updatePropertyDisplay();
      this.cdr.detectChanges();
    });

    // Subscribe to route parameters changes
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.propertyId = Number(id);
        this.loadProperty(this.propertyId);
        this.checkIfSaved(this.propertyId);
        this.incrementViewCount(this.propertyId);
        this.loadSimilarProperties(this.propertyId);
        
        // Scroll to top when property changes
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0);
        }
      } else {
        this.errorMessage = this.translate.instant('PROPERTY_VIEW.INVALID_ID');
        this.isLoading = false;
      }
    });
  }

  incrementViewCount(id: number) {
    this.propertyService.incrementViewCount(id).subscribe({
      next: () => console.log('View count incremented'),
      error: (err) => console.error('Failed to increment view count:', err)
    });
  }

  loadProperty(id: number) {
    this.isLoading = true;
    this.propertyService.getProperty(id).subscribe({
      next: (data) => {
        this.property = data;
        this.mapData(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading property', err);
        this.errorMessage = this.translate.instant('PROPERTY_VIEW.LOAD_ERROR');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSimilarProperties(id: number) {
    this.isLoadingSimilar = true;
    this.chatbotService.getSimilarProperties(id).subscribe({
      next: (response) => {
        if (response.success && response.similarProperties) {
          this.similarProperties = response.similarProperties.slice(0, 6); // Take up to 6 properties
        }
        this.isLoadingSimilar = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading similar properties:', err);
        this.isLoadingSimilar = false;
        this.cdr.detectChanges();
      }
    });
  }

  private mapData(data: PropertyDetailsDto) {
    this.price = data.price;
    this.currency = data.currency;
    this.rentPriceMonthly = data.rentPriceMonthly || 0;

    // Calculate financial estimates
    this.downPayment = (data.price * 0.10).toLocaleString();
    this.installment = ((data.price * 0.9) / 72).toLocaleString(undefined, { maximumFractionDigits: 0 });
    this.installmentPeriod = '6 years';

    this.updatePropertyDisplay();

    // Image mapping
    const mainImg = data.images.find(i => i.isMain) || data.images[0];
    this.mainImageUrl = mainImg ? mainImg.imageUrl : '';

    this.specs = {
      beds: data.rooms || 0,
      baths: data.bathrooms || 0,
      area: data.area || 0
    };

    this.viewCount = data.viewCount || 0;
    this.whatsappClickCount = data.whatsAppClicks || 0;

    // Split description by newlines
    const desc = this.getDescription();
    this.description = desc ? desc.split('\n').filter(Boolean) : [];

    this.updatePropertySpecs();

    // Agent data
    if (data.agent && data.agent.id && data.agent.id !== '00000000-0000-0000-0000-000000000000') {
      this.agent = {
        id: data.agent.id,
        name: data.agent.fullName,
        email: data.agent.email || '',
        phone: data.agent.phone || '',
        whatsapp: data.agent.whatsAppNumber || '',
        activeListings: data.agent.activePropertiesCount || 0,
        imageUrl: data.agent.profileImageUrl || '',
        company: '',
        role: '',
        experience: ''
      };
    }
  }

  private updatePropertyDisplay() {
    if (!this.property) return;

    const data = this.property;
    
    // Update title and location based on language
    if (this.currentLang === 'en') {
      this.title = data.titleEn || data.title;
      const parts = [data.projectNameEn, data.districtEn, data.cityEn].filter(Boolean);
      // Fallback to default fields if En fields are empty, but prefer En if at least one exists
      if (parts.length > 0) {
        this.location = parts.join(', ');
      } else {
        // If no English location data, fallback to default (likely Arabic) rather than showing nothing
        this.location = [data.projectName, data.district, data.city].filter(Boolean).join(', ');
      }
    } else {
      this.title = data.title;
      this.location = [data.projectName, data.district, data.city].filter(Boolean).join(', ');
    }

    // Update description based on language
    const desc = this.getDescription();
    this.description = desc ? desc.split('\n').filter(Boolean) : [];

    // Update property specs with current language
    this.updatePropertySpecs();
  }

  // ... (keeping other methods same)

  // Helper methods for similar properties
  getSimilarPropertyTitle(prop: PropertyListItemDto): string {
    if (this.currentLang === 'en') {
      return prop.titleEn || prop.title;
    }
    return prop.title;
  }

  getSimilarPropertyLocation(prop: PropertyListItemDto): string {
    if (this.currentLang === 'en') {
      // Prioritize English fields over the pre-computed location string (which might be Arabic)
      const city = prop.cityEn || prop.city;
      const district = prop.districtEn || prop.district;
      
      if (city || district) {
        return district ? `${district}, ${city}` : city || '';
      }
      
      // Fallback
      return prop.location || '';
    }
    return prop.location || prop.city || '';
  }

  private updatePropertySpecs() {
    if (!this.property) return;

    const data = this.property;
    const propertyType = this.currentLang === 'en' ? (data.propertyTypeEn || data.propertyType) : data.propertyType;

    this.propertySpecs = [
      { label: this.translate.instant('PROPERTY_VIEW.TYPE_LABEL'), value: propertyType },
      { label: this.translate.instant('PROPERTY_VIEW.PURPOSE_LABEL'), value: this.mapPurpose(data.purpose) },
      { label: this.translate.instant('PROPERTY_VIEW.REFERENCE_LABEL'), value: `REF-${data.id}` },
      { label: this.translate.instant('PROPERTY_VIEW.STATUS_LABEL'), value: data.status },
      { label: this.translate.instant('PROPERTY_VIEW.FURNISHING_LABEL'), value: this.mapFinishing(data.finishingType) },
      { label: this.translate.instant('PROPERTY_VIEW.PUBLISHED_LABEL'), value: new Date(data.createdAt).toLocaleDateString() }
    ];
  }

  private getDescription(): string {
    if (!this.property) return '';
    if (this.currentLang === 'en') {
      return this.property.descriptionEn || this.property.description || '';
    }
    return this.property.description || '';
  }

  private mapPurpose(val: string | undefined): string {
    if (val === 'ForSale') return this.translate.instant('PROPERTY_VIEW.FOR_SALE');
    if (val === 'ForRent') return this.translate.instant('PROPERTY_VIEW.FOR_RENT');
    if (val === 'Both') return this.translate.instant('PROPERTY_VIEW.FOR_BOTH');
    return val || '';
  }

  private mapFinishing(val?: string): string {
    if (!val || val === 'None') return this.translate.instant('PROPERTY_VIEW.NO_FINISHING');
    if (val === 'Semi') return this.translate.instant('PROPERTY_VIEW.SEMI_FINISHING');
    if (val === 'Full') return this.translate.instant('PROPERTY_VIEW.FULL_FINISHING');
    if (val === 'SuperLux') return this.translate.instant('PROPERTY_VIEW.SUPER_LUX');
    return val;
  }

  // Contact Methods with tracking
  callAgent() {
    if (this.agent.phone && this.propertyId) {
      this.propertyService.trackPhoneClick(this.propertyId).subscribe({
        next: () => console.log('Phone click tracked'),
        error: (err) => console.error('Failed to track phone click:', err)
      });
      window.open(`tel:${this.agent.phone}`, '_self');
    }
  }

  emailAgent() {
    if (this.agent.email) {
      window.open(`mailto:${this.agent.email}`, '_self');
    }
  }

  whatsappAgent() {
    if (this.agent.whatsapp && this.propertyId) {
      // Track WhatsApp click
      this.propertyService.trackWhatsAppClick(this.propertyId).subscribe({
        next: () => {
          console.log('WhatsApp click tracked');
          this.whatsappClickCount++;
        },
        error: (err) => console.error('Failed to track WhatsApp click:', err)
      });

      const url = `https://wa.me/${this.agent.whatsapp}`;
      window.open(url, '_blank');
    }
  }

  // Navigate to agent profile
  viewAgentProfile() {
    if (this.agent.id) {
      const encodedId = encodeAgentId(this.agent.id);
      this.router.navigate(['/agent-profile', encodedId]);
    }
  }

  /**
   * Check if this property is saved
   */
  checkIfSaved(propertyId: number) {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.savedPropertyService.isPropertySaved(propertyId).subscribe({
      next: (response) => {
        this.isSaved = response.isSaved;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to check saved status:', error);
      }
    });
  }

  /**
   * Toggle save/unsave this property
   */
  toggleSave() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.propertyId === null) return;

    this.savedPropertyService.toggleSaveProperty(this.propertyId).subscribe({
      next: (response) => {
        this.isSaved = response.isSaved;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to toggle save:', error);
      }
    });
  }

}
