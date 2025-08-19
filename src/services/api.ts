// API Configuration
const API_CONFIG = {
  // WordPress API endpoints
  wordpress: {
    baseUrl:  'https://your-site.com/wp-json/wp/v2',
    authUrl:   'https://your-site.com/wp-json/jwt-auth/v1',
  },
  // HubSpot API endpoints
  hubspot: {
    baseUrl: 'https://api.hubapi.com',
    apiKey: '',
    portalId: '',
  }
};

// API Type
export type ApiType = 'wordpress' | 'hubspot';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  businessName?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
}

// Login/Register data interfaces
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  state: string;
  postcode: string;
  businessName: string;
  password?: string;
}

// Dashboard stats interface
export interface DashboardStats {
  totalCommissions: number;
  pendingCommissions: number;
  totalReferrals: number;
  conversionRate: number;
}

// API Response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Base API class
class BaseAPI {
  protected apiType: ApiType;

  constructor(apiType: ApiType = 'wordpress') {
    this.apiType = apiType;
  }

  protected async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('authToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }
}

export default BaseAPI;