import React, { useEffect, useState } from "react";
import axios from "axios";
import OrganizerHeader from "./OrganizerHeader"; // your organizer header component

const OrganizerBookingsView = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  // Separate bookings by status
  const bookedEvents = bookings.filter((b) => b.status === "Booked");
  const completedEvents = bookings.filter((b) => b.status === "Completed");

  const renderTable = (events) => (
    <table className="min-w-full border border-gray-300 mb-8">
      <thead>
        <tr className="bg-gray-200 text-center bg-rose-300">
          <th className="p-2 border border-gray-700">Event</th>
          <th className="p-2 border border-gray-700">Attendee</th>
          <th className="p-2 border border-gray-700">Venue</th>
          <th className="p-2 border border-gray-700">Date</th>
          <th className="p-2 border border-gray-700">Time</th>
          <th className="p-2 border border-gray-700">Attendees</th>
          <th className="p-2 border border-gray-700">Meals</th>
          <th className="p-2 border border-gray-700">Total Cost</th>
          <th className="p-2 border border-gray-700">Status</th>
        </tr>
      </thead>
      <tbody>
        {events.map((b) => (
          <tr key={b.id} className="text-center">
            <td className="p-2 border border-gray-700">{b.eventName}</td>
            <td className="p-2 border border-gray-700">{b.attendee.name} ({b.attendee.email})</td>
            <td className="p-2 border border-gray-700">{b.venue.name}</td>
            <td className="p-2 border border-gray-700">{b.date}</td>
            <td className="p-2 border border-gray-700">{b.startTime} - {b.endTime}</td>
            <td className="p-2 border border-gray-700">{b.attendees}</td>
            <td className="p-2 border border-gray-700">
              {b.breakfast && "🍳Breakfast "} {b.lunch && "🍲Lunch "} {b.dinner && "🍽️Dinner"}
            </td>
            <td className="p-2 border border-gray-700">₹{b.totalCost}</td>
            <td className="p-2 border border-gray-700">{b.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <OrganizerHeader />
      <div className="p-6 ml-64 mt-16">
        <h2 className="text-xl text-rose-600 mt-4 font-bold mb-4">Booked Events</h2>
        {bookedEvents.length === 0 ? <p>No upcoming booked events.</p> : renderTable(bookedEvents)}

        <h2 className="text-xl text-rose-600 font-bold mb-4">Completed Events</h2>
        {completedEvents.length === 0 ? <p>No completed events yet.</p> : renderTable(completedEvents)}
      </div>
    </div>
  );
};

export default OrganizerBookingsView;
