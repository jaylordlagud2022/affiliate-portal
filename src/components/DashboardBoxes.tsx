import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { UserPlus, TrendingUp, Gift, Newspaper, X } from "lucide-react"; // added X for close icon

const DashboardBoxes = () => {
  const [data, setData] = useState<
    { key: "leads" | "pipeline" | "commissions" | "news"; title: string; value: string | number }[]
  >([
    { key: "leads", title: "Prospects", value: "" },
    { key: "pipeline", title: "Opportunities", value: "" },
    { key: "commissions", title: "Your rewards", value: "" },
    { key: "news", title: "Property Investor news", value: "Coming soon" },
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
          `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-leads?token=${token}`
        );
        const leadsData = await leadsRes.json();

        const pipelineRes = await fetch(
          `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-pipeline?token=${token}`
        );
        const pipelineData = await pipelineRes.json();

        const commRes = await fetch(
          `https://api.propertyinvestors.com.au/wp-json/hubspot-login/v1/widget-1-commissions?token=${token}`
        );
        const commData = await commRes.json();

        setLeads(leadsData.data ?? []);
        setPipeline(pipelineData.data ?? []);
        setCommissions(commData.data ?? []);

        const totalCommission = (commData.data?.length ?? 0) * 5000;

        setData([
          { key: "leads", title: "Prospects", value: leadsData.data?.length ?? 0 },
          { key: "pipeline", title: "Opportunities", value: pipelineData.data?.length ?? 0 },
          { key: "commissions", title: "Your rewards", value: `$${totalCommission}` },
          { key: "news", title: "Property Investor news", value: "Coming soon" },
        ]);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

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
        {
          name: "Client Name",
          selector: (row: any) =>
            row.contact
              ? `${row.contact.firstname ?? ""} ${row.contact.lastname ?? ""}`.trim()
              : "-",
          sortable: true,
        },
        { name: "Opportunity Name", selector: (row: any) => row.dealname || "-", sortable: true },
        { name: "Opportunity Stage", selector: (row: any) => row.dealstage || "-", sortable: true },
        { name: "Meeting Date", selector: (row: any) => row.meeting || "-", sortable: true },
      ];
    } else {
      return [
        {
          name: "Client Name",
          selector: (row: any) =>
            row.contact
              ? `${row.contact.firstname ?? ""} ${row.contact.lastname ?? ""}`.trim()
              : "-",
          sortable: true,
        },
        { name: "Opportunity Name", selector: (row: any) => row.dealname || "-", sortable: true },
        { name: "Opportunity Stage", selector: (row: any) => row.dealstage || "-", sortable: true },
        { name: "Commission", selector: () => "$5000", sortable: true },
      ];
    }
  };

  const openModal = (type: "leads" | "pipeline" | "commissions") => {
    setModalType(type);
    setModalTitle(
      type === "leads" ? "Prospects" : type === "pipeline" ? "Opportunities" : "Your rewards"
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

  const getIcon = (key: string) => {
    switch (key) {
      case "leads":
        return <UserPlus className="w-[65px] h-[65px] text-[#d02c37] mb-2" />;
      case "pipeline":
        return <TrendingUp className="w-[65px] h-[65px] text-[#d02c37] mb-2" />;
      case "commissions":
        return <Gift className="w-[65px] h-[65px] text-[#d02c37] mb-2" />;
      case "news":
        return <Newspaper className="w-[65px] h-[65px] text-white mb-2" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {data.map((box, index) => {
          if (box.key === "news") {
            return (
              <div
                key={index}
                className="bg-[#d02c37] text-white rounded-xl shadow-lg flex flex-col items-center justify-center w-full h-64"
              >
                {getIcon(box.key)}
                <span className="tracking-[-2.7px] text-[2em] font-bold text-center">{box.title}</span>
                <span className="text-[1.5em] text-center mt-1">{box.value}</span>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="bg-[#EFEFEF] border border-gray-200 rounded-xl shadow-md flex flex-col items-center justify-center w-full h-64 hover:shadow-lg transition leading-[25px]"
            >
              {getIcon(box.key)}
              <span className="tracking-[-2.7px] text-[2em] font-medium text-center mb-2">{box.title}</span>
              <span className="text-[1.5em] text-center mb-1">
                {loading ? "Loading..." : box.value}
              </span>
              <button
                onClick={() => {
                  if (box.key === "leads") openModal("leads");
                  if (box.key === "pipeline") openModal("pipeline");
                  if (box.key === "commissions") openModal("commissions");
                }}
                className="bg-[#d02c37] text-white px-4 py-2 rounded-md hover:bg-black transition w-[200px]"
              >
                View
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            {modalLoading ? (
              <div className="text-center py-6">Loading...</div>
            ) : (
              <DataTable
                columns={getColumns(modalType)}
                data={modalData}
                pagination
                highlightOnHover
                striped
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardBoxes;
