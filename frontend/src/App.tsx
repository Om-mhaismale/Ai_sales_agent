import Sidebar from "./components/sidebar";
import Background from "./components/background";
import Dashboard from "./components/dashboard";
import ConvoCall from "./components/convo_call";
import BookingsCalendar from "./components/reminder";
import ContactsView from "./components/crms";
import { useState } from "react";

function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");

  return (
    <Background>
      <div className="flex">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 p-4 overflow-auto">
          {activeSection === "Dashboard" && <Dashboard />}
          {activeSection === "Chats/Calls" && <ConvoCall />}
          {activeSection === "Reminders" && <BookingsCalendar />}
          {activeSection === "CRMs" && <ContactsView />}
        </div>
      </div>
    </Background>
  );
}

export default App;
