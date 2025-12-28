import { PropertyListItemDto } from '../Property/property-list-item.dto';

export interface SavedPropertyDto {
    savedPropertyId: number;
    savedAt: Date;
    property: PropertyListItemDto;
}

export interface ToggleSaveResponse {
    propertyId: number;
    isSaved: boolean;
    message: string;
}

export interface IsSavedResponse {
    propertyId: number;
    isSaved: boolean;
}
