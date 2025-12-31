export interface Property {
  id: number;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  rentPriceMonthly: number;
  currency: string;
  
  // Property Type (bilingual)
  propertyType: string;
  propertyTypeEn?: string;
  
  // Location (bilingual)
  city: string;
  cityEn?: string;
  district: string;
  districtEn?: string;
  projectName: string;
  projectNameEn?: string;
  projectLogoUrl?: string;
  
  // Location string (computed)
  location: string;
  locationEn?: string;
  
  // Specs
  area: number;
  rooms: number;
  bathrooms: number;
  
  // Images
  mainImageUrl: string;
  
  // Status & Features
  isFeatured: boolean;
  status: string;
  purpose: string;
  finishingType: string;
  
  // Analytics
  viewCount: number;
  createdAt: string;

  // Display fields
  adType?: string;
  type?: string;
  bedrooms?: number;
  imageUrl?: string;
  agentLogoUrl?: string;
  downPayment?: number;
  monthlyInstallment?: number;
  developer?: string;
  handoverDate?: string;

  // Agent fields
  agentId: string;
  agentName: string;
  agentProfileImage: string;
}
