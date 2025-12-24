export interface Agent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsAppNumber: string;
  profileImageUrl: string;
  isVerified: boolean;
  isActive: boolean;
  activePropertiesCount: number;
  totalPropertiesCount: number;
  createdAt: string; 
}



import { Property } from '../Property/property'; 

export interface AgentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsAppNumber: string;
  profileImageUrl: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  
  totalPropertiesCount: number;
  activePropertiesCount: number;
  soldOrRentedCount: number;
  properties: Property[];
}