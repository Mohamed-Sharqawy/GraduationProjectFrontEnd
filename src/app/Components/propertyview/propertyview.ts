import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../Services/Property-Service/property.service';
import { AgentService } from '../../Services/Agent-Service/agent.service';
import { PropertyDetailsDto } from '../../Models/Property/property-details.dto';

@Component({
  selector: 'app-propertyview',
  imports: [CommonModule],
  templateUrl: './propertyview.html',
  styleUrl: './propertyview.css',
})
export class Propertyview implements OnInit {
  // Static Fallback Data
  price = 0;
  currency = 'EGP';
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

  // Analytics (Mock Data)
  viewCount = 142; // Static random number
  whatsappClickCount = 15;

  description: string[] = [];

  propertySpecs: { label: string; value: string }[] = [];

  // Default Broker ID for fallback - Replace with a valid ID from your DB
  private readonly DEFAULT_AGENT_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

  agent = {
    name: 'Ahmed Mohamed',
    company: 'Deal Real Estate',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Senior Property Consultant',
    experience: '5 Years',
    activeListings: 101,
    email: '',
    phone: '',
    whatsapp: ''
  };

  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private agentService: AgentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(Number(id));
    } else {
      this.errorMessage = 'Invalid property ID.';
      this.isLoading = false;
    }
  }

  loadProperty(id: number) {
    this.isLoading = true;
    this.propertyService.getProperty(id).subscribe({
      next: (data) => {
        this.mapData(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading property', err);
        this.errorMessage = 'Failed to load property details.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private mapData(data: PropertyDetailsDto) {
    this.price = data.price;
    this.currency = data.currency;

    // Calculate financial estimates if not provided
    this.downPayment = (data.price * 0.10).toLocaleString(); // 10%
    this.installment = ((data.price * 0.9) / 72).toLocaleString(undefined, { maximumFractionDigits: 0 }); // 6 years monthly
    this.installmentPeriod = '6 years';

    this.location = [data.projectName, data.district, data.city].filter(Boolean).join(', ');
    this.title = data.title;

    // Image mapping
    const mainImg = data.images.find(i => i.isMain) || data.images[0];
    this.mainImageUrl = mainImg ? mainImg.imageUrl : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400';

    this.specs = {
      beds: data.rooms || 0,
      baths: data.bathrooms || 0,
      area: data.area || 0
    };

    // Split description by newlines or use as single item
    this.description = data.description ? data.description.split('\n') : ['No description available.'];

    this.propertySpecs = [
      { label: 'Type', value: data.propertyType },
      { label: 'Purpose', value: this.mapPurpose(data.purpose) },
      { label: 'Reference no.', value: `REF-${data.id}` }, // Mock ref
      { label: 'Completion', value: data.status },
      { label: 'Furnishing', value: this.mapFinishing(data.finishingType) },
      { label: 'Published at', value: new Date(data.createdAt).toLocaleDateString() },
      { label: 'Ownership', value: 'Freehold' } // defaulting
    ];

    // Agent Logic
    if (data.agent && data.agent.id && data.agent.id !== '00000000-0000-0000-0000-000000000000') {
      this.updateAgentDisplay({
        fullName: data.agent.fullName,
        email: data.agent.email,
        phone: data.agent.phone,
        whatsAppNumber: data.agent.whatsAppNumber,
        profileImageUrl: data.agent.profileImageUrl,
        activePropertiesCount: data.agent.activePropertiesCount
      });
    } else {
      this.loadDefaultAgent();
    }
  }

  private loadDefaultAgent() {
    this.agentService.getAgentProfile(this.DEFAULT_AGENT_ID).subscribe({
      next: (profile) => {
        this.updateAgentDisplay(profile);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load default agent', err)
    });
  }

  private updateAgentDisplay(info: any) {
    this.agent.name = info.fullName || this.agent.name;
    this.agent.email = info.email;
    this.agent.phone = info.phone;
    this.agent.whatsapp = info.whatsAppNumber;
    this.agent.activeListings = info.activePropertiesCount ?? this.agent.activeListings;

    if (info.profileImageUrl) {
      this.agent.imageUrl = info.profileImageUrl;
    }
  }

  private mapPurpose(val: string): string {
    if (val === '0' || val === '1') return 'Buy';
    if (val === '2') return 'Rent';
    return val;
  }

  private mapFinishing(val?: string): string {
    if (!val) return 'Unfurnished';
    if (val === '1' || val === '3') return 'Ultra Lux';
    if (val === '2') return 'Super Lux';
    return val;
  }

  // Contact Methods
  callAgent() {
    if (this.agent.phone) window.open(`tel:${this.agent.phone}`, '_self');
  }

  emailAgent() {
    if (this.agent.email) window.open(`mailto:${this.agent.email}`, '_self');
  }

  whatsappAgent() {
    if (this.agent.whatsapp) {
      // Mock tracking click
      this.whatsappClickCount++;

      const url = `https://wa.me/${this.agent.whatsapp}`;
      window.open(url, '_blank');
    }
  }
}
