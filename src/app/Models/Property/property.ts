export interface Property {
  id: number;
  title: string;
  price: number;
  rentPriceMonthly: number;
  currency: string;
  propertyType: string;
  propertyTypeEn: string;
  city: string;
  cityEn: string;
  district: string;
  districtEn: string;
  projectName: string;
  area: number;
  rooms: number;
  bathrooms: number;
  mainImageUrl: string;
  isFeatured: boolean;
  status: string;
  purpose: string;
  finishingType: string;
  location: string;
  viewCount: number;
  createdAt: string;

  // Added fields to match PropertyService and Component usage
  adType?: string;
  type?: string;
  bedrooms?: number;
  description?: string;
  imageUrl?: string;
  agentLogoUrl?: string;
  downPayment?: number;
  monthlyInstallment?: number;
  developer?: string;
  handoverDate?: string;

  agentId: string;
  agentName: string;
  agentProfileImage: string;
}
