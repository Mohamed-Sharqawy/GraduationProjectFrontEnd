export const API_EndPoints = {
    account: '/Account',
    login: '/login',
    register: '/register',
    getCurrentUser: '/me',
    properties: '/properties',
    agents: '/agents',
    subscriptions: '/Subscriptions',
    savedProperties: '/SavedProperties',
    updateProfile: '/update-profile',
    uploadPhoto: '/upload-photo',
    
    // Lookups Endpoints
    lookups: {
        cities: '/lookups/cities',
        districts: '/lookups/districts',
        projects: '/lookups/projects',
        propertyTypes: '/lookups/property-types',
        propertyImages: '/lookups/properties' // Use: /lookups/properties/{id}/images
    }
};
