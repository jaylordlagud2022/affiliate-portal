import React, { useState, useEffect } from 'react';

// Define possible application statuses for clarity
type ApplicationStatus = 'registered' | 'reviewed' | 'approved' | 'active';

// Mock DashboardService to simulate API calls
// In a real application, this would be a separate file
// with actual API integration (e.g., using fetch or axios).
class DashboardService {
  private platform: string;

  constructor(platform: string) {
    this.platform = platform;
  }

  async getDashboardStats(): Promise<{ success: boolean; data: any }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            totalCommissions: 1250.75,
            pendingCommissions: 200.50,
            totalReferrals: 150,
            conversionRate: 0.15,
            earnings: {
              total: 1250.75,
              commission: '10%',
            },
            leads: 150,
            pipeline: 30,
            marketing: 'New campaign updates available!',
            // Added currentApplicationStatus to mock data
            currentApplicationStatus: 'approved', // This will determine the active step
          },
        });
      }, 1000); // Simulate network delay
    });
  }

  async getRecentActivity(): Promise<{ success: boolean; data: any[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            { id: 1, type: 'Referral', date: '2025-07-30', description: 'New user signed up from your link.' },
            { id: 2, type: 'Commission', date: '2025-07-28', description: 'Commission earned: $50.00' },
            { id: 3, type: 'Lead', date: '2025-07-25', description: 'Lead converted to customer.' },
            { id: 4, type: 'Referral', date: '2025-07-20', description: 'Another new user registered.' },
          ],
        });
      }, 1500); // Simulate network delay
    });
  }

  async generateReferralLink(): Promise<{ success: boolean; data: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: `https://your-affiliate-portal.com/refer?ref=${Math.random().toString(36).substring(7)}`,
        });
      }, 500); // Simulate network delay
    });
  }
}

const AffiliateActivity: React.FC = () => {
  // State for dashboard statistics
  const [stats, setStats] = useState({
    totalCommissions: 0,
    pendingCommissions: 0,
    totalReferrals: 0,
    conversionRate: 0,
    earnings: {
      total: 0,
      commission: '',
    },
    leads: 0,
    pipeline: 0,
    marketing: '',
  });

  // State for recent activity
  const [activity, setActivity] = useState<any[]>([]);

  // State for referral link
  const [referralLink, setReferralLink] = useState('');

  // State for loading indicator
  const [loading, setLoading] = useState(true);

  // New state for application status
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>('registered');

  // Initialize the dashboard service (can be 'wordpress', 'hubspot', etc.)
  const dashboardService = new DashboardService('wordpress');

  // Define the order of steps
  const progressSteps: ApplicationStatus[] = ['registered', 'reviewed', 'approved', 'active'];

  // Helper function to determine if a step is complete or active
  const isStepComplete = (step: ApplicationStatus) => {
    const currentIdx = progressSteps.indexOf(applicationStatus);
    const stepIdx = progressSteps.indexOf(step);
    return stepIdx <= currentIdx;
  };

  const isStepActive = (step: ApplicationStatus) => {
    return applicationStatus === step;
  };

  // useEffect hook to load data when the component mounts
  useEffect(() => {
    loadDashboardData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true); // Set loading to true when data fetching starts

    try {
      // Fetch dashboard statistics
      const statsResult = await dashboardService.getDashboardStats();
      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
        // Update application status from fetched data
        if (statsResult.data.currentApplicationStatus) {
          setApplicationStatus(statsResult.data.currentApplicationStatus);
        }
      }

      // Fetch recent activity
      const activityResult = await dashboardService.getRecentActivity();
      if (activityResult.success && activityResult.data) {
        setActivity(activityResult.data);
      }

      // Generate referral link
      const linkResult = await dashboardService.generateReferralLink();
      if (linkResult.success && linkResult.data) {
        setReferralLink(linkResult.data);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Optionally, handle error state in UI
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete (success or error)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">

          {/* Affiliate Activity Section */}
          <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-3xl font-extrabold text-gray-800">AFFILIATE DASHBOARD</h2>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh Data'}
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-500 text-lg">Loading dashboard data...</div>
            ) : (
              <>
                {/* Progress Steps */}
                <h3 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3">Application Status</h3>
                <div className="flex items-center justify-between mb-8 flex-wrap"> {/* Added flex-wrap for responsiveness */}
                  {progressSteps.map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center flex-1 min-w-[80px] text-center px-1"> {/* Adjusted flex-1 and min-width */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                            ${isStepActive(step) ? 'bg-blue-600 animate-pulse' : isStepComplete(step) ? 'bg-green-600' : 'bg-gray-300'}`}
                        >
                          {isStepComplete(step) ? '✓' : isStepActive(step) ? '→' : ''}
                        </div>
                        <span className="text-sm mt-2 text-gray-700 capitalize">{step}</span>
                      </div>
                      {index < progressSteps.length - 1 && (
                        <div
                          className={`flex-1 h-px mx-2 transition-colors duration-300
                            ${isStepComplete(progressSteps[index + 1]) ? 'bg-green-600' : isStepActive(progressSteps[index]) ? 'bg-blue-600' : 'bg-gray-300'}`}
                        ></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>


                {/* Dynamic Message based on Application Status */}
                <div className="text-center mb-8 p-4 bg-blue-50 rounded-lg text-blue-800 border border-blue-200 shadow-sm">
                  {applicationStatus === 'registered' && (
                    <p className="font-semibold">Your application has been received and is awaiting review.</p>
                  )}
                  {applicationStatus === 'reviewed' && (
                    <p className="font-semibold">Your application has been reviewed and is awaiting final approval.</p>
                  )}
                  {applicationStatus === 'approved' && (
                    <p className="font-semibold">Congratulations! Your application has been approved. You can now use your referral link.</p>
                  )}
                  {applicationStatus === 'active' && (
                    <p className="font-semibold">Welcome to the active affiliate program! Start sharing your link to earn.</p>
                  )}
                  {/* Default message if status is not recognized */}
                  {!progressSteps.includes(applicationStatus) && (
                    <p className="font-semibold">A member of our team will review your application. If approved, you'll receive your log in details via email.</p>
                  )}
                </div>


                {/* Referral Link Section */}
                <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 flex flex-col sm:flex-row items-center justify-between shadow-sm">
                  <p className="text-blue-800 font-semibold mb-3 sm:mb-0 mr-4">Your Referral Link:</p>
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-grow p-3 border border-blue-300 rounded-md bg-white text-gray-700 font-mono text-sm mr-4 w-full sm:w-auto"
                    onClick={(e) => (e.target as HTMLInputElement).select()} // Select text on click
                  />
                  <button
                    onClick={() => {
                      // Copy to clipboard logic using document.execCommand for iFrame compatibility
                      const tempInput = document.createElement('textarea');
                      tempInput.value = referralLink;
                      document.body.appendChild(tempInput);
                      tempInput.select();
                      document.execCommand('copy');
                      document.body.removeChild(tempInput);
                      alert('Referral link copied to clipboard!'); // Using alert for simplicity, consider custom modal for production
                    }}
                    className="mt-3 sm:mt-0 px-5 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Copy Link
                  </button>
                </div>

                {/* Dashboard Cards (Stats) */}
                <h3 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3">Overview Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-bold text-gray-800">Total Earnings</h4>
                    <p className="text-2xl font-extrabold text-green-600 mt-2">${stats.earnings.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Commission Rate: {stats.earnings.commission}</p>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-bold text-gray-800">Total Leads</h4>
                    <p className="text-2xl font-extrabold text-blue-600 mt-2">{stats.leads}</p>
                    <p className="text-sm text-gray-600">Number of leads generated</p>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-bold text-gray-800">Leads in Pipeline</h4>
                    <p className="text-2xl font-extrabold text-yellow-600 mt-2">{stats.pipeline}</p>
                    <p className="text-sm text-gray-600">Leads in progress</p>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-bold text-gray-800">Conversion Rate</h4>
                    <p className="text-2xl font-extrabold text-purple-600 mt-2">{(stats.conversionRate * 100).toFixed(2)}%</p>
                    <p className="text-sm text-gray-600">Conversions from leads</p>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <h3 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3">Recent Activity</h3>
                {activity.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {activity.map((item) => (
                        <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col">
                            <span className="text-gray-800 font-medium">{item.type}</span>
                            <span className="text-gray-600 text-sm">{item.description}</span>
                          </div>
                          <span className="text-gray-500 text-xs">{item.date}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No recent activity to display.</div>
                )}

                {/* Marketing Updates Section */}
                <h3 className="text-2xl font-bold text-gray-700 mt-10 mb-6 border-b pb-3">Marketing Updates</h3>
                <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800 shadow-sm">
                  <p className="font-semibold">{stats.marketing || 'No new marketing updates at this time.'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateActivity;
