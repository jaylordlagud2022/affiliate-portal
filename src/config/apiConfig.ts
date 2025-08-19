// API Configuration file
// Set your API type and endpoints here

export type ApiType = 'wordpress' | 'hubspot';

// Change this to switch between WordPress and HubSpot
export const DEFAULT_API_TYPE: ApiType = 'wordpress';

// WordPress Configuration
export const WORDPRESS_CONFIG = {
  baseUrl: process.env.REACT_APP_WP_BASE_URL || 'https://your-wordpress-site.com/wp-json/wp/v2',
  authUrl: process.env.REACT_APP_WP_AUTH_URL || 'https://your-wordpress-site.com/wp-json/jwt-auth/v1',
  // Add custom endpoints for affiliate functionality
  endpoints: {
    affiliateStats: '/affiliate-stats',
    affiliateRegister: '/affiliate-register',
    users: '/users',
  }
};

// HubSpot Configuration  
export const HUBSPOT_CONFIG = {
  baseUrl: 'https://api.hubapi.com',
  apiKey: process.env.REACT_APP_HUBSPOT_API_KEY || '',
  portalId: process.env.REACT_APP_HUBSPOT_PORTAL_ID || '',
  endpoints: {
    contacts: '/contacts/v1/contact',
    deals: '/deals/v1/deal',
    contactByEmail: '/contacts/v1/contact/email',
  }
};

// Environment variables you need to set:
// REACT_APP_WP_BASE_URL=https://your-wordpress-site.com/wp-json/wp/v2
// REACT_APP_WP_AUTH_URL=https://your-wordpress-site.com/wp-json/jwt-auth/v1
// REACT_APP_HUBSPOT_API_KEY=your-hubspot-api-key
// REACT_APP_HUBSPOT_PORTAL_ID=your-hubspot-portal-id