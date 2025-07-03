// src/components/ContactsView.tsx
import { useState } from "react";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastContacted: string;
  channel: string;
  status: string;
  activity: string[];
  notes: string;
};

const dummyContacts: Contact[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    lastContacted: "2025-06-25",
    channel: "WhatsApp",
    status: "Lead",
    activity: ["Call on 2025-06-20", "Email on 2025-06-21"],
    notes: "Interested in demo.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9123456780",
    lastContacted: "2025-07-01",
    channel: "Email",
    status: "Booked",
    activity: ["Form filled on 2025-06-29"],
    notes: "Follow-up needed next week.",
  },
];

export default function ContactsView() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Contacts</h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full w-full bg-white/10 rounded shadow">
          <thead>
            <tr className="bg-white/20 text-left text-sm font-semibold text-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3">Email / Phone</th>
              <th className="p-3">Last Contacted</th>
              <th className="p-3">Channel</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyContacts.map((contact) => (
              <tr key={contact.id} className="border-t hover:bg-white/20">
                <td className="p-3">{contact.name}</td>
                <td className="p-3">
                  {contact.email}
                  <br />
                  {contact.phone}
                </td>
                <td className="p-3">{contact.lastContacted}</td>
                <td className="p-3">{contact.channel}</td>
                <td className="p-3">{contact.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="text-[#06d6a0] hover:underline cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white/90 p-6 rounded-lg w-full max-w-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {selectedContact.name}'s Profile
            </h3>
            <p>
              <strong>Email:</strong> {selectedContact.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedContact.phone}
            </p>
            <p>
              <strong>Channel:</strong> {selectedContact.channel}
            </p>
            <p>
              <strong>Status:</strong> {selectedContact.status}
            </p>
            <div className="mt-4">
              <strong>Activity Timeline:</strong>
              <ul className="list-disc pl-5 text-sm mt-1">
                {selectedContact.activity.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <strong>Notes:</strong>
              <p className="text-sm">{selectedContact.notes}</p>
            </div>
            <button
              onClick={() => setSelectedContact(null)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
