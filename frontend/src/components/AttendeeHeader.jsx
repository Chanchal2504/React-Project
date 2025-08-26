import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // You can rename this to a general Header if needed
import Logo from "../assets/LastLogo.png";
export default function AttendeeHeader() {
  const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      window.location.href = "/login"; // redirect if not logged in
    } else {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex">
      {/* Side Section */}
      <aside className="w-64 min-h-screen bg-teal-200 shadow-md fixed top-0 left-0 pt-20 mt-16">
        <div className="flex flex-col space-y-4 px-6">
          {user?.image && (
            <img
              src={user.image}
              onClick={() => setIsOpen(true)}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 mx-auto mb-4"
            />
          )}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="bg-white rounded-full p-1 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking the circle
              >
                <img
                  src={user.image} // corrected here
                  alt="Profile"
                  className="w-64 h-64 rounded-full object-cover"
                />
              </div>
            </div>
          )}
          <h3 className="text-center font-semibold text-lg">{user?.name}</h3>

          <nav className="flex flex-col space-y-3 mt-6">
            <a
              onClick={() => navigate(`/dashboard/Attendee`)}
              className="px-3 py-2 rounded transition font-medium cursor-pointer"
            >
              Home
            </a>
            <a
              href="/venue/all"
              className="px-3 py-2 rounded transition font-medium"
            >
              View All Venues
            </a>
            <a
              href="/venue/bookinghistory"
              className="px-3 py-2 rounded transition font-medium"
            >
              Booking History
            </a>
            <a
              href="#notifications"
              className="px-3 py-2 rounded transition font-medium"
            >
              Notifications
            </a>
            <a
              onClick={handleLogout}
              className="px-3 py-2 text-rose-500 rounded hover:text-rose-700 transition font-medium cursor-pointer"
            >
              Logout
            </a>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <header className="fixed top-0 left-0 w-full bg-teal-600 shadow-md z-10">
        <div className="flex items-center justify-between px-6 py-4 ml-12">
          {/* Logo */}
          <img 
          src={Logo} 
          alt="Eventopia" 
          className="h-15 w-40"
          
        />


          {/* User info */}
          <div className="flex items-center space-x-4">
            <span className="truncate max-w-xs">{user?.name}</span>
              {user?.image && (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                />
              )}
            </div>
          </div>
        </header>

        {/* Placeholder for main page content */}
        
      </div>
    </div>
  );
}
