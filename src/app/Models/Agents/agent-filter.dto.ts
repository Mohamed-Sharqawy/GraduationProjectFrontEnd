export interface AgentFilterDto {
    searchTerm?: string;
    cityId?: number;
    purpose?: number; // 1=ForSale, 2=ForRent
    isVerified?: boolean;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
}
