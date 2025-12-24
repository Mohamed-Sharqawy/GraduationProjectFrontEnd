export interface PropertyFilterDto {
    // Purpose filter (Buy = 1, Rent = 2, Both = 3)
    purpose?: number;

    // Location filters
    cityId?: number;
    districtId?: number;
    projectId?: number;

    // Property type filter
    propertyTypeId?: number;

    // Price filters
    minPrice?: number;
    maxPrice?: number;

    // For rent price
    minRentPrice?: number;
    maxRentPrice?: number;

    // Area filter
    minArea?: number;
    maxArea?: number;

    // Rooms filter
    minRooms?: number;
    maxRooms?: number;

    // Bathrooms filter
    minBathrooms?: number;

    // Status filter (0=PendingReview, 1=Active, 2=SoldOrRented, 3=Hidden, 4=Rejected)
    status?: number;

    // Finishing type (0=None, 1=Semi, 2=Full)
    finishingType?: number;

    // Featured only
    isFeatured?: boolean;

    // Search term (searches in title and description)
    searchTerm?: string;

    // Pagination
    pageNumber?: number;
    pageSize?: number;

    // Sorting
    sortBy?: string; // CreatedAt, Price, Area, Featured
    sortDescending?: boolean;
}
