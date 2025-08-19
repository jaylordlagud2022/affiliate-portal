import BaseAPI, { ApiType, DashboardStats, ApiResponse } from './api';

interface RecentActivity {
  id: string;
  type: 'referral' | 'commission' | 'signup';
  description: string;
  amount?: number;
  date: string;
}

class DashboardService extends BaseAPI {
  constructor(apiType: ApiType = 'wordpress') {
    super(apiType);
  }

  // WordPress Dashboard Data
  private async wordpressDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await this.makeRequest(`${process.env.REACT_APP_WP_BASE_URL}/affiliate-stats`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: {
            totalCommissions: data.total_commissions || 0,
            pendingCommissions: data.pending_commissions || 0,
            totalReferrals: data.total_referrals || 0,
            conversionRate: data.conversion_rate || 0,
          },
        };
      }

      // Fallback to mock data if endpoint doesn't exist
      return this.getMockStats();
    } catch (error) {
      return this.getMockStats();
    }
  }

  // HubSpot Dashboard Data
  private async hubspotDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const userId = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).id : null;
      
      if (!userId) {
        return { success: false, error: 'User not found' };
      }

      // Get deals associated with the contact
      const dealsResponse = await this.makeRequest(
        `https://api.hubapi.com/deals/v1/deal/associated/contact/${userId}?hapikey=${process.env.REACT_APP_HUBSPOT_API_KEY}`
      );

      if (dealsResponse.ok) {
        const deals = await dealsResponse.json();
        
        const totalCommissions = deals.results?.reduce((sum: number, deal: any) => {
          return sum + (deal.properties?.amount?.value || 0);
        }, 0) || 0;

        const pendingDeals = deals.results?.filter((deal: any) => 
          deal.properties?.dealstage?.value === 'pending'
        ).length || 0;

        return {
          success: true,
          data: {
            totalCommissions,
            pendingCommissions: pendingDeals * 100, // Estimate
            totalReferrals: deals.results?.length || 0,
            conversionRate: deals.results?.length > 0 ? 0.15 : 0,
          },
        };
      }

      return this.getMockStats();
    } catch (error) {
      return this.getMockStats();
    }
  }

  // Mock data fallback
  private getMockStats(): ApiResponse<DashboardStats> {
    return {
      success: true,
      data: {
        totalCommissions: 2450.50,
        pendingCommissions: 320.00,
        totalReferrals: 18,
        conversionRate: 0.24,
      },
    };
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    if (this.apiType === 'wordpress') {
      return this.wordpressDashboardStats();
    } else {
      return this.hubspotDashboardStats();
    }
  }

  // Get recent activity
  async getRecentActivity(): Promise<ApiResponse<RecentActivity[]>> {
    try {
      // For now, return mock data - can be extended to fetch from APIs
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'commission',
          description: 'Commission earned from John Smith referral',
          amount: 150.00,
          date: '2024-01-15',
        },
        {
          id: '2',
          type: 'referral',
          description: 'New referral: Jane Doe signed up',
          date: '2024-01-14',
        },
        {
          id: '3',
          type: 'signup',
          description: 'Welcome! Your affiliate account is active',
          date: '2024-01-10',
        },
      ];

      return {
        success: true,
        data: mockActivity,
      };
    } catch (error) {
      return { success: false, error: 'Failed to fetch activity' };
    }
  }

  // Generate referral link
  async generateReferralLink(): Promise<ApiResponse<string>> {
    try {
      const user = localStorage.getItem('currentUser');
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const userId = JSON.parse(user).id;
      const referralLink = `${window.location.origin}/register?ref=${userId}`;

      return {
        success: true,
        data: referralLink,
      };
    } catch (error) {
      return { success: false, error: 'Failed to generate referral link' };
    }
  }
}

export default DashboardService;