import { ChevronFirst, ChevronLast, MoreVertical, LayoutDashboard, MessageCircle, Bell, Users, Settings } from "lucide-react"
import logo from "/public/bot.png"
import profile from "../assets/react.svg"
import { createContext, useContext, useState } from "react"

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
    const [expanded, setExpanded] = useState(true)
    return (
        <>
            <aside className="h-screen">
                <nav className="h-full flex flex-col bg-[#073b4c]/10 border-r shadow-sm backdrop-blur-sm">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`} />
                        <button
                            onClick={() => setExpanded((curr) => !curr)}
                            className="p-1.5 rounded-lg hover: transition cursor-pointer text-blue-50 hover:text-gray-500"
                            aria-label="Toggle sidebar"
                        >
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3 py-4 space-y-2">
                            <SidebarItem
                                icon={<LayoutDashboard size={20} />}
                                text="Dashboard"
                                active={activeSection === "Dashboard"}
                                onClick={() => setActiveSection("Dashboard")}
                            />
                            <SidebarItem
                                icon={<MessageCircle size={20} />}
                                text="Chats/Calls"
                                active={activeSection === "Chats/Calls"}
                                onClick={() => setActiveSection("Chats/Calls")}
                            />
                            <SidebarItem
                                icon={<Bell size={20} />}
                                text="Reminders"
                                active={activeSection === "Reminders"}
                                onClick={() => setActiveSection("Reminders")}
                            />
                            <SidebarItem
                                icon={<Users size={20} />}
                                text="CRMs"
                                active={activeSection === "CRMs"}
                                onClick={() => setActiveSection("CRMs")}
                            />
                            <SidebarItem icon={<Settings size={20} />} text="Settings" />
                        </ul>
                    </SidebarContext.Provider>

                    <div className="border-t flex p-3 mt-2">
                        <img src={profile} className="w-10 h-10 rounded-md" />
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                            <div className="leading-4">
                                <h4 className="font-semibold">Sales bot</h4>
                                <span className="text-xs text-gray-600">salesbot@gmail.com</span>
                            </div>
                            <MoreVertical size={20} />
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    )
}

interface SidebarItemProps {
    icon: React.ReactNode;
    text: string;
    active?: boolean;
    alert?: boolean;
    onClick?: () => void;
}

// Update SidebarItem for more vertical padding
export function SidebarItem({ icon, text, active, alert, onClick }: SidebarItemProps) {
    const { expanded } = useContext(SidebarContext)
    return (
        <li
            className={`relative flex items-center py-3 px-3 my-7 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-indigo-200 to-[#118ab2] text-indigo-800" : "text-[#118ab2] hover:text-[#06d6a0]"}`}
            onClick={onClick}
        >
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-50 ml-3" : "w-0"}`}>{text}</span>
            {alert && (
                <div className={`absolute right-2 w-5 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
            )}

            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                    {text}
                </div>
            )}
        </li>
    )
}
