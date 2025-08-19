import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const DashboardBoxes = () => {
  const [data, setData] = useState([
    { title: "Earnings (Lifetime)", value: "" },
    { title: "New leads", value: "" },
    { title: "Current Pipeline", value: "" },
    { title: "Commissions Due", value: "" },
    { title: "Marketing", value: "" },
    { title: "Messaging", value: "" },
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

  const token = "f1e365232e104880d566d6c2a902aae7"; // Replace dynamically

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const leadsRes = await fetch(
          `https://affiliate.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-leads?token=${token}`
        );
        const leadsData = await leadsRes.json();

        const pipelineRes = await fetch(
          `https://affiliate.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-pipeline?token=${token}`
        );
        const pipelineData = await pipelineRes.json();

        const commRes = await fetch(
          `https://affiliate.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-commissions?token=${token}`
        );
        const commData = await commRes.json();

        setLeads(leadsData.data ?? []);
        setPipeline(pipelineData.data ?? []);
        setCommissions(commData.data ?? []);

        const totalCommission = (commData.data?.length ?? 0) * 5000;

        setData([
          { title: "Earnings (Lifetime)", value: "$0" },
          { title: "New leads", value: leadsData.data?.length ?? 0 },
          { title: "Current Pipeline", value: pipelineData.data?.length ?? 0 },
          { title: "Commissions Due", value: `$${totalCommission}` },
          { title: "Marketing", value: "" },
          { title: "Messaging", value: "" },
        ]);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
        ? "New Leads"
        : type === "pipeline"
        ? "Current Pipeline"
        : "Commissions Due"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data.map((box, index) => (
          <div
            key={index}
            className="bg-[#d02c37] text-white p-8 rounded-lg shadow-md cursor-pointer"
            onClick={() => {
              if (box.title === "New leads") openModal("leads");
              if (box.title === "Current Pipeline") openModal("pipeline");
              if (box.title === "Commissions Due") openModal("commissions");
            }}
          >
            <div className="text-xl font-bold text-white mb-2">{box.title}</div>
            {loading ? (
              <div className="text-lg font-medium">Loading...</div>
            ) : (
              <div className="text-3xl font-extrabold">{box.value}</div>
            )}
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
                defaultSortField={modalType === "leads" ? "Created" : "Meeting Date"}
                defaultSortAsc={false}
                noDataComponent={`No ${modalType} found`}
              />
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
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
