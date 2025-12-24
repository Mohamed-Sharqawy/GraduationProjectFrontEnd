import { PropertyListItemDto } from '../Property/property-list-item.dto';

export interface AgentProfileDto {
    id: string; // Guid
    fullName: string;
    email?: string;
    phone?: string;
    whatsAppNumber?: string;
    profileImageUrl?: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string; // DateTime

    // Statistics
    totalPropertiesCount: number;
    activePropertiesCount: number;
    soldOrRentedCount: number;

    // Agent's Properties
    properties: PropertyListItemDto[];
}
