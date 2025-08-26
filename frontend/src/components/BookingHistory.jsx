import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendeeHeader from "./AttendeeHeader";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("Before token");
        const token = localStorage.getItem("token");
        console.log("After token");
        const res = await axios.get("http://localhost:5000/api/my-bookings", {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("After request");

        setBookings(res.data.bookings);
      } catch (err) {
        console.error("❌ Error fetching booking history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading booking history...</p>;

  return (
    <div>
         <AttendeeHeader/>
    <div className="p-6 ml-64 mt-16">
       
      <h2 className="text-xl font-bold mb-4 text-rose-600">My Booking History</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="min-w-full border border-gray-700">
          <thead>
            <tr className="bg-rose-300 ">
              <th className="p-2 border border-gray-700">Event</th>
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
            {bookings.map((b) => (
              <tr key={b.id} className="text-center">
                <td className="p-2 border border-gray-700">{b.eventName}</td>
                <td className="p-2 border border-gray-700">{b.venue?.name}</td>
                <td className="p-2 border border-gray-700">{b.date}</td>
                <td className="p-2 border border-gray-700">
                  {b.startTime} - {b.endTime}
                </td>
                <td className="p-2 border border-gray-700">{b.attendees}</td>
                <td className="p-2 border border-gray-700">
                  {b.breakfast && "🍳Breakfast "} 
                  {b.lunch && "🍲Lunch "} 
                  {b.dinner && "🍽️Dinner"}
                </td>
                <td className="p-2 border border-gray-700">₹{b.totalCost}</td>
                <td className="p-2 border border-gray-700">{b.status}</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default BookingHistory;
