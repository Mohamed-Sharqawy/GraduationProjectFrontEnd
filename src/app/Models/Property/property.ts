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
  
  
  agentId: string;
  agentName: string;
  agentProfileImage: string;
}
