import Sidebar from "./components/sidebar";
import Background from "./components/background";
import Dashboard from "./components/dashboard";
import ConvoCall from "./components/convo_call";
import BookingsCalendar from "./components/reminder";
import ContactsView from "./components/crms";
import { useState, useEffect } from "react";
import { auth } from './firebase-config';
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import Signup from "./components/signup";

function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return <Signup />;
  }

  return (
    <Background>
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          user={user}
          onLogout={handleLogout}
        />
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
