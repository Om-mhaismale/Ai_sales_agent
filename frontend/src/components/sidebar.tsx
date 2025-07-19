import { ChevronFirst, ChevronLast, MoreVertical, LayoutDashboard, MessageCircle, Bell, Users, Settings } from "lucide-react"
import logo from "../assets/bot.png"
import profile from "../assets/react.svg"
import { createContext, useContext, useState, useRef, useEffect, useLayoutEffect } from "react"

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    user: any;
    onLogout: () => void;
}

export default function Sidebar({ activeSection, setActiveSection, user, onLogout }: SidebarProps) {
    const [expanded, setExpanded] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    // Removed unused menuPos state

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    // Position menu diagonally above and right of the button
    useLayoutEffect(() => {
        if (menuOpen && buttonRef.current) {
            // Menu positioning logic was here, but menuPos is unused
        }
    }, [menuOpen]);

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

                    <div className="border-t flex p-3 mt-2 relative">
                        <img
                            src={user?.photoURL || profile}
                            className="w-10 h-10 rounded-md"
                            alt="profile"
                        />
                        <div className={`flex justify-between items-center transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                            <div className="leading-4">
                                <h4 className="font-semibold">{user?.displayName || "Sales bot"}</h4>
                                <span className="text-xs text-gray-600">{user?.email || "salesbot@gmail.com"}</span>
                            </div>
                            <div className="relative flex items-center">
                                <button
                                    ref={buttonRef}
                                    onClick={() => setMenuOpen((open) => !open)}
                                    className="ml-2 p-1 rounded hover:bg-gray-200/30 cursor-pointer"
                                    aria-label="Open menu"
                                    type="button"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {menuOpen && (
                                    <div
                                        ref={menuRef}
                                        className="absolute left-7 bottom-full mb-2 bg-[#06d69ef1] bg-opacity-10 shadow-lg rounded min-w-[200px] z-50"
                                    >
                                        <button
                                            className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-[#529482] text-gray-800"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onLogout();
                                            }}
                                        >
                                            Logout
                                        </button>
                                        <button
                                            className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-[#529482] text-gray-800"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onLogout();
                                            }}
                                        >
                                            Sign in/up with other account
                                        </button>
                                    </div>
                                )}
                            </div>
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
