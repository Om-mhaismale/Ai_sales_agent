import Sidebar from "./components/sidebar";
import Background from "./components/background";
import Dashboard from "./components/dashboard";
import ConvoCall from "./components/convo_call";
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
          {/* Add more sections as needed */}
        </div>
      </div>
    </Background>
  );
}

export default App;
