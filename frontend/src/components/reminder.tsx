import { useState } from "react";

type ReminderStatus = "scheduled" | "confirmed" | "completed" | "cancelled";

interface Reminder {
  id: number;
  title: string;
  date: string;
  time: string;
  status: ReminderStatus;
  customer: string;
  notes: string;
}

const mockReminders: Reminder[] = [
  {
    id: 1,
    title: "Demo Call - John",
    date: "2025-07-05",
    time: "10:00",
    status: "confirmed",
    customer: "John Doe",
    notes: "Wants to know more about pricing plans.",
  },
  {
    id: 2,
    title: "Follow-up - Alice",
    date: "2025-07-06",
    time: "15:30",
    status: "scheduled",
    customer: "Alice Smith",
    notes: "Needs a follow-up call.",
  },
];

const statusColor: Record<ReminderStatus, string> = {
  scheduled: "bg-[#ffd166]",
  confirmed: "bg-blue-400",
  completed: "bg-green-400",
  cancelled: "bg-red-400",
};

export default function BookingsCalendar() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reminders</h1>
      <table className="min-w-full bg-white/10 rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Time</th>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {mockReminders.map((reminder) => (
            <tr key={reminder.id} className="border-b">
              <td className="py-2 px-4">{reminder.date}</td>
              <td className="py-2 px-4">{reminder.time}</td>
              <td className="py-2 px-4">{reminder.title}</td>
              <td className="py-2 px-4">{reminder.customer}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded text-white text-xs ${statusColor[reminder.status]}`}>
                  {reminder.status}
                </span>
              </td>
              <td className="py-2 px-4">{reminder.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}