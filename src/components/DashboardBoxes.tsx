import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const DashboardBoxes = () => {
  const [data, setData] = useState<
    { key: "leads" | "pipeline" | "commissions" | "income"; title: string; value: string | number }[]
  >([
    { key: "leads", title: "Prospects", value: "" },
    { key: "pipeline", title: "Opportunities", value: "" },
    { key: "commissions", title: "Referral fees due", value: "" },
    { key: "income", title: "Total affiliate income", value: "" },
  ]);

  const [leads, setLeads] = useState<any[]>([]);
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState<"leads" | "pipeline" | "commissions">("leads");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const token = localStorage.getItem("authToken");
  if (!token) return null;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const leadsRes = await fetch(
          `http://52.64.155.40/wp-json/hubspot-login/v1/widget-1-leads?token=${token}`
        );
        const leadsData = await leadsRes.json();

        const pipelineRes = await fetch(
          `http://52.64.155.40/wp-json/hubspot-login/v1/widget-1-pipeline?token=${token}`
        );
        const pipelineData = await pipelineRes.json();

        const commRes = await fetch(
          `http://52.64.155.40/wp-json/hubspot-login/v1/widget-1-commissions?token=${token}`
        );
        const commData = await commRes.json();

        setLeads(leadsData.data ?? []);
        setPipeline(pipelineData.data ?? []);
        setCommissions(commData.data ?? []);

        const totalCommission = (commData.data?.length ?? 0) * 5000;

        setData([
          { key: "leads", title: "Prospects", value: leadsData.data?.length ?? 0 },
          { key: "pipeline", title: "Opportunities", value: pipelineData.data?.length ?? 0 },
          { key: "commissions", title: "Referral fees due", value: `$${totalCommission}` },
          { key: "income", title: "Total affiliate income", value: "$0" },
        ]);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  // Define DataTable columns dynamically
  const getColumns = (type: "leads" | "pipeline" | "commissions") => {
    if (type === "leads") {
      return [
        { name: "Name", selector: (row: any) => row.lead_name || "-", sortable: true },
        { name: "Email", selector: (row: any) => row.email || "-", sortable: true },
        {
          name: "Created",
          selector: (row: any) =>
            row.created ? new Date(row.created).toLocaleDateString() : "-",
          sortable: true,
        },
      ];
    } else if (type === "pipeline") {
      return [
        { name: "Deal Name", selector: (row: any) => row.dealname || "-", sortable: true },
        { name: "Stage", selector: (row: any) => row.dealstage || "-", sortable: true },
        {
          name: "Meeting Date",
          selector: (row: any) =>
            row.meeting ? new Date(row.meeting).toLocaleString() : "-",
          sortable: true,
        },
      ];
    } else {
      return [
        { name: "Deal Name", selector: (row: any) => row.dealname || "-", sortable: true },
        { name: "Stage", selector: (row: any) => row.dealstage || "-", sortable: true },
        { name: "Commission", selector: () => 5000, sortable: true },
      ];
    }
  };

  // Open modal and sort data by date descending
  const openModal = (type: "leads" | "pipeline" | "commissions") => {
    setModalType(type);
    setModalTitle(
      type === "leads"
        ? "Prospects"
        : type === "pipeline"
        ? "Opportunities"
        : "Referral fees due"
    );
    setIsModalOpen(true);
    setModalLoading(true);

    setTimeout(() => {
      let sortedData: any[] = [];
      if (type === "leads") {
        sortedData = [...leads].sort(
          (a, b) =>
            (b.created ? new Date(b.created).getTime() : 0) -
            (a.created ? new Date(a.created).getTime() : 0)
        );
      } else if (type === "pipeline") {
        sortedData = [...pipeline].sort(
          (a, b) =>
            (b.meeting ? new Date(b.meeting).getTime() : 0) -
            (a.meeting ? new Date(a.meeting).getTime() : 0)
        );
      } else {
        sortedData = [...commissions];
      }
      setModalData(sortedData);
      setModalLoading(false);
    }, 300);
  };

  return (
    <div className="p-4">
      {/* Dashboard Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {data.map((box, index) => (
          <div
            key={index}
            className="bg-[#d02c37] text-white p-12 rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            onClick={() => {
              if (box.key === "leads") openModal("leads");
              if (box.key === "pipeline") openModal("pipeline");
              if (box.key === "commissions") openModal("commissions");
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-white">{box.title}</span>
              {loading ? (
                <span className="text-2xl font-medium">Loading...</span>
              ) : (
                <span className="text-2xl font-bold">{box.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-4">{modalTitle}</h2>

            {modalLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-600 border-t-transparent"></div>
                <span className="ml-3 text-lg font-medium text-gray-700">
                  Loading...
                </span>
              </div>
            ) : (
              <DataTable
                columns={getColumns(modalType)}
                data={modalData}
                pagination
                highlightOnHover
                striped
                dense
                noDataComponent={`No ${modalType} found`}
              />
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-[#d02c37] text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBoxes;
