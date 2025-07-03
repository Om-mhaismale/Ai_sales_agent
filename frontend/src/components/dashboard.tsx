// src/components/dashboard.tsx
import { LayoutDashboardIcon } from "lucide-react";
import { useEffect, useState } from "react";
// import { FaChartBar } from "react-icons/fa";
// import Clock from "react-live-clock";

export default function Dashboard() {
  // Dummy placeholders for KPIs
  const [kpis, setKpis] = useState({
    leads: 0,
    bookings: 0,
    conversations: 0,
    sentiment: "Loading...",
  });

  const [activityFeed, setActivityFeed] = useState<string[]>([
    "New lead from +91 XXXXX XXXX via WhatsApp",
    "Meeting booked with jane.doe@example.com",
    "Reminder sent to john.smith@example.com",
  ]);

  useEffect(() => {
    // fetch or update real data here later
  }, []);

  return (
    <div className="p-6 space-y-6 text-[#77d8f8]">
      {/* Header */}
      <div className="flex items-center space-x-3 text-2xl font-bold">
        <LayoutDashboardIcon className="text-indigo-600" />
        <h1>Main Dashboard</h1>
      </div>

      {/* Clock */}
      <div className="text-sm text-gray-100">
        <p>{new Date().toLocaleString()}</p>

      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPIBox label="New Leads Today" value={kpis.leads} />
        <KPIBox label="Bookings Made" value={kpis.bookings} />
        <KPIBox label="Conversations Handled" value={kpis.conversations} />
        <KPIBox label="Positive Sentiment" value={kpis.sentiment} />
      </div>

      {/* Activity Feed */}
      <div>
        <h2 className="text-lg font-semibold">Activity Feed (Live Updates)</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {activityFeed.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Conversion Funnel */}
      <div>
        <h2 className="text-lg font-semibold">Conversion Funnel</h2>
        <p className="text-sm">Leads → Engaged → Booked → Attended</p>
      </div>

      {/* Channel Performance */}
      <div>
        <h2 className="text-lg font-semibold">
          Channel Performance (Which Channel Works Best?)
        </h2>
        <p className="text-sm">Voice, WhatsApp, Email</p>
      </div>
    </div>
  );
}

// Reusable KPI box component
const KPIBox = ({ label, value }: { label: string; value: number | string }) => (
  <div className="bg-[#66ffbd6e] p-4 rounded-lg shadow-md text-center">
    <div className="text-sm text-[#000000]">{label}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);
