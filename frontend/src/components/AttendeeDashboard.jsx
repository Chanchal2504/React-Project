import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendeeHeader from "./AttendeeHeader";
import { useNavigate } from "react-router-dom"; // You can rename this to a general Header if needed
const AttendeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  
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

  // Fetch events + my events + venues
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    const fetchMyEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${user?.id}/events`
        );
        setMyEvents(res.data);
      } catch (err) {
        console.error("Error fetching my events:", err);
      }
    };

    const fetchVenues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/venue/all");
        // You can sort/filter to get "popular" ones, e.g. by rating or bookings count
        const popular = res.data.slice(0, 6); // just take top 6 for now
        setVenues(popular);
      } catch (err) {
        console.error("Error fetching venues:", err);
      }
    };

    if (user) {
      fetchEvents();
      fetchMyEvents();
      fetchVenues();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AttendeeHeader />

      {/* Welcome Hero */}
      <div className="p-6 text-center mt-20 ml-64">
        <h2 className="text-2xl font-bold text-rose-600">Welcome, {user?.name}!</h2>
      </div>

      {/* Popular Venues Section */}
      <div className="p-6 ml-64">
        <h3 className="text-xl font-semibold mb-4 ">🌟 Popular Venues</h3>
        {venues.length === 0 ? (
          <p className="text-gray-500">No popular venues available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <a 
                onClick={() => navigate(`/venue/detail/${venue.id}`)}
                key={venue._id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
              >
                {venue.image && (
                  <img
                    src={`http://localhost:5000/uploads/${venue.image}`}
                    alt={venue.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h4 className="text-lg font-bold">{venue.name}</h4>
                <p className="text-gray-600 text-sm">{venue.location}</p>
                <p className="text-gray-800 mt-2 text-sm">
                  Capacity: {venue.capacity}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeDashboard;
