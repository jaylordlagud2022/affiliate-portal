import React, { useState, useEffect } from "react";

type ApplicationStatus = "registered" | "reviewed" | "approved" | "active";

const AffiliateActivity: React.FC = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    leads: 0,
    pipeline: 0,
    conversionRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] =
    useState<ApplicationStatus>("registered");

  const progressSteps: ApplicationStatus[] = [
    "registered",
    "reviewed",
    "approved",
    "active",
  ];

  const isStepComplete = (step: ApplicationStatus) =>
    progressSteps.indexOf(step) <= progressSteps.indexOf(applicationStatus);

  const isStepActive = (step: ApplicationStatus) =>
    applicationStatus === step;

  const token = "f1e365232e104880d566d6c2a902aae7"; // replace with dynamic

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [leadsRes, pipelineRes, commRes, statusRes] = await Promise.all([
        fetch(
          `https://affiliate.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-leads?token=${token}`
        ).then((res) => res.json()),
        fetch(
          `https://affiliate.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-pipeline?token=${token}`
        ).then((res) => res.json()),
        fetch(
          `https://affiliate.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-commissions?token=${token}`
        ).then((res) => res.json()),
        fetch(
          `https://affiliate.propertyinvestors.com.au/wp-json/hubspot-login/v1/application-status?token=${token}`
        ).then((res) => res.json()).catch(() => null), // optional endpoint
      ]);

      const leads = leadsRes.data?.length ?? 0;
      const pipeline = pipelineRes.data?.length ?? 0;
      const commissions = commRes.data?.length ?? 0;

      setStats({
        totalEarnings: commissions * 5000, // adjust as needed
        leads,
        pipeline,
        conversionRate: leads > 0 ? (commissions / leads) * 100 : 0,
      });

      if (statusRes?.data?.status) {
        setApplicationStatus('approved');
       // setApplicationStatus(statusRes.data.status);
      }
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="">
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-3xl font-extrabold text-gray-800">
                AFFILIATE OVERVIEW
              </h2>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh Data"}
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                Loading dashboard data...
              </div>
            ) : (
              <>
                {/* Progress Steps (unchanged design) */}
                <h3 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3">
                  Application Status
                </h3>
                <div className="flex items-center justify-between mb-8 flex-wrap">
                  {progressSteps.map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center flex-1 min-w-[80px] text-center px-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                            ${
                              isStepActive(step)
                                ? "bg-blue-600 animate-pulse"
                                : isStepComplete(step)
                                ? "bg-green-600"
                                : "bg-gray-300"
                            }`}
                        >
                          {isStepComplete(step)
                            ? "✓"
                            : isStepActive(step)
                            ? "→"
                            : ""}
                        </div>
                        <span className="text-sm mt-2 text-gray-700 capitalize">
                          {step}
                        </span>
                      </div>
                      {index < progressSteps.length - 1 && (
                        <div
                          className={`flex-1 h-px mx-2 transition-colors duration-300 relative
                            ${
                              isStepComplete(progressSteps[index + 1])
                                ? "bg-green-600"
                                : isStepActive(progressSteps[index])
                                ? "bg-blue-600"
                                : "bg-gray-300"
                            }`}
                        ></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Stats Section */}
                <h3 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-3">
                  Overview Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 text-center shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800">
                      Total Earnings
                    </h4>
                    <p className="text-2xl font-extrabold text-green-600 mt-2">
                      ${stats.totalEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 text-center shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800">
                      Total Leads
                    </h4>
                    <p className="text-2xl font-extrabold text-blue-600 mt-2">
                      {stats.leads}
                    </p>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 text-center shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800">
                      Leads in Pipeline
                    </h4>
                    <p className="text-2xl font-extrabold text-yellow-600 mt-2">
                      {stats.pipeline}
                    </p>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 text-center shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800">
                      Conversion Rate
                    </h4>
                    <p className="text-2xl font-extrabold text-purple-600 mt-2">
                      {stats.conversionRate.toFixed(2)}%
                    </p>
                  </div>
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
