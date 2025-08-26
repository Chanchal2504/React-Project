import React, { useEffect, useState } from "react";
import axios from "axios";
import OrganizerHeader from "./OrganizerHeader";

const OrganizerBookings = () => {
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

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/booking/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove the booking from requests if it’s no longer pending
      setBookings((prev) =>
        prev.filter((b) => b.id !== bookingId)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
      console.error(err);
    }
  };

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <OrganizerHeader />
      <div className="p-6 ml-64 mt-16">
        <h2 className="text-xl font-bold mb-4 text-rose-600 mt-4">Booking Requests</h2>
        {bookings.filter(b => b.status === "Requested").length === 0 ? (
          <p>No bo  oking requests found.</p>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="p-2 border">Event</th>
                <th className="p-2 border">Attendee</th>
                <th className="p-2 border">Venue</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Attendees</th>
                <th className="p-2 border">Meals</th>
                <th className="p-2 border">Total Cost</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Confirm</th>
                <th className="p-2 border">Cancel</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter((b) => b.status === "Requested") // only pending requests
                .map((b) => (
                  <tr key={b.id} className="text-center">
                    <td className="p-2 border border-gray-700">{b.eventName}</td>
                    <td className="p-2 border border-gray-700">{b.attendee.name} ({b.attendee.email})</td>
                    <td className="p-2 border border-gray-700">{b.venue.name}</td>
                    <td className="p-2 border border-gray-700">{b.date}</td>
                    <td className="p-2 border border-gray-700">{b.startTime} - {b.endTime}</td>
                    <td className="p-2 border border-gray-700">{b.attendees}</td>
                    <td className="p-2 border border-gray-700">
                      {b.breakfast && "🍳Breakfast"} {b.lunch && "🍲Lunch "} {b.dinner && "🍽️Dinner"}
                    </td>
                    <td className="p-2 border border-gray-700">₹{b.totalCost}</td>
                    <td className="p-2 border border-gray-700">{b.status}</td>
                    <td className="p-2 border border-gray-700">
                      <button
                        onClick={() => handleUpdateStatus(b.id, "booked")}
                        className="px-2 py-1 bg-green-700 text-white rounded"
                      >
                        Confirm
                      </button>
                    </td>
                    <td className="p-2 border border-gray-700">
                      <button
                        onClick={() => handleUpdateStatus(b.id, "cancelled")}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrganizerBookings;
