import { useState, useEffect, useCallback, useMemo } from "react";

type ReminderStatus = "scheduled" | "confirmed" | "completed" | "cancelled";
type ViewMode = "bookings" | "book-slot" | "admin" | "login";
type TabType = "all" | "today" | "upcoming" | "completed" | "cancelled";

interface Reminder {
  id: number;
  name: string;
  phone: string;
  email: string;
  date: string;
  slot: string;
  reminder_sent: boolean;
  feedback_sent: boolean;
  status: ReminderStatus;
  notes?: string;
}

const statusColor: Record<ReminderStatus, string> = {
  scheduled: "bg-[#ffd166]",
  confirmed: "bg-blue-400", // Used for "upcoming" when reminder sent but feedback not sent
  completed: "bg-green-400", // Used when feedback is sent
  cancelled: "bg-red-400",
};

export default function BookingsCalendar() {
  const [currentView, setCurrentView] = useState<ViewMode>("bookings");
  const [bookings, setBookings] = useState<Reminder[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    slot: "",
  });

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  // ✅ Memoized API base URL
  const API_BASE = useMemo(() => 'http://localhost:5000/api', []);

  // ✅ Optimized loadBookings with useCallback
  const loadBookings = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/bookings`);
      const data = await response.json();
      // Map bookings and auto-determine status based on reminder and feedback
      setBookings(data.map((booking: any) => {
        let autoStatus = booking.status || "scheduled";
        
        // Auto-determine status based on reminder and feedback
        if (booking.feedback_sent) {
          autoStatus = "completed";
        } else if (booking.reminder_sent && !booking.feedback_sent) {
          autoStatus = "confirmed"; // This represents "upcoming/confirmed"
        } else {
          autoStatus = booking.status || "scheduled";
        }
        
        return { 
          ...booking, 
          status: autoStatus 
        };
      }));
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError("Failed to load bookings");
    }
  }, [API_BASE]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // ✅ Fixed booking submission
  const handleBookingSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm)
      });
      const result = await response.json();

      if (result.success) {
        setMessage("✅ Your slot is successfully booked!");
        setBookingForm({ name: "", phone: "", email: "", date: "", slot: "" });
        await loadBookings(); // Refresh the list
        
        // ✅ Cleanup timeout on unmount
        const timeoutId = setTimeout(() => {
          setMessage("");
          setCurrentView("bookings");
        }, 3000);
        
        return () => clearTimeout(timeoutId);
      } else {
        setError("Failed to book slot. Please try again.");
      }
    } catch (err) {
      setError("Failed to book slot. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [bookingForm, API_BASE, loadBookings]);

  // ✅ Optimized login
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const result = await response.json();

      if (result.success) {
        setIsAdmin(true);
        setCurrentView("admin");
        setLoginForm({ username: "", password: "" });
        setError("");
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loginForm, API_BASE]);

  // ✅ Memoized logout
  const handleLogout = useCallback(() => {
    setIsAdmin(false);
    setCurrentView("bookings");
    setError("");
    setMessage("");
  }, []);

  // ✅ Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  // ✅ Filter bookings by tab type
  const getFilteredBookings = useCallback((tab: TabType) => {
    const today = getTodayDate();
    
    let filtered = bookings;
    
    // Filter by search term first
    if (searchTerm.trim()) {
      filtered = filtered.filter(booking => 
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.date.includes(searchTerm)
      );
    }
    
    // Then filter by tab
    switch (tab) {
      case "today":
        return filtered.filter(booking => booking.date === today);
      case "upcoming":
        return filtered.filter(booking => 
          booking.date >= today && (booking.status === "scheduled" || booking.status === "confirmed")
        );
      case "completed":
        return filtered.filter(booking => booking.status === "completed");
      case "cancelled":
        return filtered.filter(booking => booking.status === "cancelled");
      default:
        return filtered;
    }
  }, [bookings, getTodayDate, searchTerm]);

  // ✅ Get counts for each tab
  const getTabCounts = useCallback(() => {
    const today = getTodayDate();
    return {
      all: bookings.length,
      today: bookings.filter(booking => booking.date === today).length,
      upcoming: bookings.filter(booking => 
        booking.date >= today && (booking.status === "scheduled" || booking.status === "confirmed")
      ).length,
      completed: bookings.filter(booking => booking.status === "completed").length,
      cancelled: bookings.filter(booking => booking.status === "cancelled").length,
    };
  }, [bookings, getTodayDate]);

  // ✅ Memoized filtered bookings
  const filteredBookings = useMemo(() => getFilteredBookings(activeTab), [getFilteredBookings, activeTab]);
  const tabCounts = useMemo(() => getTabCounts(), [getTabCounts]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, currentPage, itemsPerPage]);

  // ✅ Reset page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // ✅ Memoized table rows to prevent re-rendering
  const bookingRows = useMemo(() => {
    return paginatedBookings.map((booking) => (
      <tr key={booking.id} className="border-b border-white/10 hover:bg-white/50">
        <td className="py-2 px-3 text-white text-sm">{booking.id}</td>
        <td className="py-2 px-3 text-white text-sm">{booking.name}</td>
        <td className="py-2 px-3 text-white text-sm">{booking.phone}</td>
        <td className="py-2 px-3 text-white text-sm">{booking.email}</td>
        <td className="py-2 px-3 text-white text-sm">{booking.date}</td>
        <td className="py-2 px-3 text-white text-sm">{booking.slot}</td>
        <td className="py-2 px-3 text-white text-sm">{booking.reminder_sent ? "✅" : "❌"}</td>
        <td className="py-2 px-3 text-white text-sm">{booking.feedback_sent ? "✅" : "❌"}</td>
        <td className="py-2 px-3">
          <span className={`px-2 py-1 rounded text-white text-xs ${statusColor[booking.status]}`}>
            {booking.status}
          </span>
        </td>
      </tr>
    ));
  }, [paginatedBookings]);

  // ✅ Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50 hover:bg-white/20 transition-colors text-sm"
        >
          ← Previous
        </button>
        
        <span className="text-white text-sm">
          Page {currentPage} of {totalPages} ({filteredBookings.length} items)
        </span>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50 hover:bg-white/20 transition-colors text-sm"
        >
          Next →
        </button>
      </div>
    );
  };

  // ✅ Render tab navigation
  const renderTabNavigation = () => (
    <div className="mb-4">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, phone, email, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      
      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 border-b border-white/20 pb-4">
        {[
          { key: "all", label: "All Bookings", color: "bg-gray-600 hover:bg-gray-700" },
          { key: "today", label: "Today", color: "bg-blue-600 hover:bg-blue-700" },
          { key: "upcoming", label: "Upcoming", color: "bg-green-600 hover:bg-green-700" },
          { key: "completed", label: "Completed", color: "bg-emerald-600 hover:bg-emerald-700" },
          { key: "cancelled", label: "Cancelled", color: "bg-red-600 hover:bg-red-700" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as TabType)}
            className={`px-3 py-2 text-sm rounded transition-colors text-white ${
              activeTab === key 
                ? color.replace('hover:', '') + ' ring-2 ring-white/50' 
                : color + ' opacity-70'
            }`}
          >
            {label} ({tabCounts[key as keyof typeof tabCounts]})
          </button>
        ))}
      </div>
    </div>
  );

  // ✅ Memoized components to prevent unnecessary re-renders
  const renderAdminPanel = useMemo(() => (
    <div className="h-full flex flex-col bg-white/10 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">📋 Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Logout
          </button>
        </div>
        {renderTabNavigation()}
      </div>

      <div className="flex-1 overflow-hidden px-6">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto bg-white/5 rounded-lg shadow-inner">
            <div className="min-w-[800px]"> {/* Minimum width to prevent cramping */}
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center text-white/70">
                  <p>No bookings found for the selected tab.</p>
                  {searchTerm && <p className="text-sm mt-2">Try adjusting your search term.</p>}
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="sticky top-0 bg-white/50 backdrop-blur-sm">
                    <tr className="border-b border-white/20">
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">ID</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Name</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Phone</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Email</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Date</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Slot</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Reminder</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Feedback</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingRows}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-6 pt-4">
        {renderPagination()}
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/5 p-3 rounded text-center">
            <div className="text-lg font-bold text-white">{tabCounts.all}</div>
            <div className="text-xs text-white/70">Total</div>
          </div>
          <div className="bg-blue-500/20 p-3 rounded text-center">
            <div className="text-lg font-bold text-white">{tabCounts.today}</div>
            <div className="text-xs text-white/70">Today</div>
          </div>
          <div className="bg-green-500/20 p-3 rounded text-center">
            <div className="text-lg font-bold text-white">{tabCounts.upcoming}</div>
            <div className="text-xs text-white/70">Upcoming</div>
          </div>
          <div className="bg-emerald-500/20 p-3 rounded text-center">
            <div className="text-lg font-bold text-white">{tabCounts.completed}</div>
            <div className="text-xs text-white/70">Completed</div>
          </div>
          <div className="bg-red-500/20 p-3 rounded text-center">
            <div className="text-lg font-bold text-white">{tabCounts.cancelled}</div>
            <div className="text-xs text-white/70">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  ), [bookingRows, handleLogout, renderTabNavigation, filteredBookings.length, tabCounts, renderPagination]);

  const renderBookingForm = () => (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Book Your Appointment</h2>

        {message && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-100">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={bookingForm.name}
            onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={bookingForm.phone}
            onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={bookingForm.email}
            onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="date"
            value={bookingForm.date}
            onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
            className="w-full p-3 rounded bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="time"
            value={bookingForm.slot}
            onChange={(e) => setBookingForm(prev => ({ ...prev, slot: e.target.value }))}
            className="w-full p-3 rounded bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition-colors"
          >
            {loading ? "Booking..." : "Book Slot"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Admin Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
            className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
            className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );

  const renderBookingsList = () => (
    <div className="h-full flex flex-col bg-white/10 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold text-white">Reminders & Bookings</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentView("book-slot")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
            >
              Book Slot
            </button>
            <button
              onClick={() => setCurrentView("login")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm"
            >
              Admin Login
            </button>
          </div>
        </div>
        {renderTabNavigation()}
      </div>

      <div className="flex-1 overflow-hidden px-6">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto bg-white/5 rounded-lg shadow-inner">
            <div className="min-w-[900px]"> {/* Increased minimum width for all columns */}
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center text-white/70">
                  <p>No bookings found for the selected tab.</p>
                  {searchTerm && <p className="text-sm mt-2">Try adjusting your search term.</p>}
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="sticky top-0 bg-black/50 backdrop-blur-sm">
                    <tr className="border-b border-white/20">
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Date</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Time</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Customer</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Phone</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Email</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Reminder</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Feedback</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Status</th>
                      <th className="py-3 px-3 text-left text-white text-sm font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-2 px-3 text-white text-sm">{booking.date}</td>
                        <td className="py-2 px-3 text-white text-sm">{booking.slot}</td>
                        <td className="py-2 px-3 text-white text-sm">{booking.name}</td>
                        <td className="py-2 px-3 text-white text-sm">{booking.phone}</td>
                        <td className="py-2 px-3 text-white text-sm">{booking.email}</td>
                        <td className="py-2 px-3 text-white text-sm">{booking.reminder_sent ? "✅" : "❌"}</td>
                        <td className="py-2 px-3 text-white text-sm">{booking.feedback_sent ? "✅" : "❌"}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded text-white text-xs ${statusColor[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-white text-sm">{booking.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-6 pt-4">
        {renderPagination()}

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white/5 p-2 rounded text-center">
            <div className="text-sm font-bold text-white">{tabCounts.all}</div>
            <div className="text-xs text-white/70">Total</div>
          </div>
          <div className="bg-blue-500/20 p-2 rounded text-center">
            <div className="text-sm font-bold text-white">{tabCounts.today}</div>
            <div className="text-xs text-white/70">Today</div>
          </div>
          <div className="bg-green-500/20 p-2 rounded text-center">
            <div className="text-sm font-bold text-white">{tabCounts.upcoming}</div>
            <div className="text-xs text-white/70">Upcoming</div>
          </div>
          <div className="bg-emerald-500/20 p-2 rounded text-center">
            <div className="text-sm font-bold text-white">{tabCounts.completed}</div>
            <div className="text-xs text-white/70">Completed</div>
          </div>
          <div className="bg-red-500/20 p-2 rounded text-center">
            <div className="text-sm font-bold text-white">{tabCounts.cancelled}</div>
            <div className="text-xs text-white/70">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {/* Navigation */}
          {currentView !== "bookings" && (
            <button
              onClick={() => setCurrentView("bookings")}
              className="mb-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              ← Back to Bookings
            </button>
          )}

          {/* Content based on current view */}
          {currentView === "bookings" && renderBookingsList()}
          {currentView === "book-slot" && renderBookingForm()}
          {currentView === "login" && renderLoginForm()}
          {currentView === "admin" && isAdmin && renderAdminPanel}
        </div>
      </div>
    </div>
  );
}