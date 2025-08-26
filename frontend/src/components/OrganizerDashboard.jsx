import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, CalendarDays } from "lucide-react";
import OrganizerHeader from "./OrganizerHeader"

const OrganizerDashboard = () => {
  const [organizer, setOrganizer] = useState(null);
  const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
  
  
  const navigate = useNavigate();

  // ✅ Load organizer info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setOrganizer(JSON.parse(storedUser));
  }, [navigate]);
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/organizer-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error("Error fetching organizer bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchBookings();
  // }, []);

  fetchBookings();
}, [organizer]);
  // // ✅ Fetch events only when organizer is loaded
  // useEffect(() => {
  //   if (organizer?._id) {
  //     axios
  //       .get("http://localhost:5000/events/organizer/${organizer._id}")
  //       .then((res) => setBookings(res.data))
  //       .catch((err) => console.error("Error fetching events:", err));
  //   }
  // }, [organizer]);

  // // ✅ Delete event
  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete("http://localhost:5000/events/${id}");
  //     setBookings((prevEvents) => prevEvents.filter((booking) => booking._id !== id));
  //   } catch (err) {
  //     console.error("Error deleting event:", err);
  //   }
  // };

  return (
    <>

      <OrganizerHeader/>
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-800">Organizer Dashboard</h1> */}
        
      </div>
      
      {/* Organizer Info */}
      {organizer && (
        <div className="bg-white shadow rounded-xl p-5 mb-6 mt-20 ml-64">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Welcome, {organizer.name}
          </h2>
          <p className="text-sm text-gray-500">Email: {organizer.email}</p>
        {/* <button
          onClick={() => navigate("/create/Event")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 mt-5 text-white rounded-xl shadow hover:bg-blue-700"
        >
          <Plus size={18} /> Create Event
        </button> */}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 ml-64">
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-3">
          <CalendarDays className="text-blue-600" />
          <div>
            <h3 className="text-sm text-gray-500">Total Events</h3>
            <p className="text-lg font-bold">{bookings.length}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-3">
          <CalendarDays className="text-green-600" />
          <div>
            <h3 className="text-sm text-gray-500">Completed</h3>
            <p className="text-lg font-bold">
              {bookings.filter((e) => new Date(e.date) < new Date()).length}
            </p>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-3">
          <CalendarDays className="text-red-600" />
          <div>
            <h3 className="text-sm text-gray-500">Pending</h3>
            <p className="text-lg font-bold">
              {bookings.filter((e) => new Date(e.date) > new Date()).length}
            </p>
          </div>
        </div>
      </div>

      {/* Events List */}
      {/* <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">My Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events created yet.</p>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="p-4 border rounded-xl flex justify-between items-center hover:shadow-md"
              >
                <div>
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()} | {event.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(/edit-event/${event._id})}
                    className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                  onClick={() => handleDelete(event._id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> 
      <div className="bg-white shadow rounded-xl p-5 ml-64">
        <h2 className="text-xl font-semibold mb-4">My Events</h2>
        
          <div className="grid gap-4">
              <div
                
                className="p-4 border rounded-xl flex justify-between items-center hover:shadow-md"
              >
                <div>
                  <h3 className="text-lg font-bold">Event A</h3>
                  <p className="text-sm text-gray-500">
                    2025-08-25 02:33:19 | Pune
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/events/edit/:id')}
                    className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    // onClick={() => handleDelete(event._id)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            
          </div>
      </div>*/}
    </div>
    </>
  );
};

export default OrganizerDashboard;