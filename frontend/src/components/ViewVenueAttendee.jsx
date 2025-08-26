import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendeeHeader from "./AttendeeHeader";
import { useNavigate } from "react-router-dom"; // You can rename this to a general Header if needed

export default function ViewVenuesAttendee() {
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch all venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/venue/all");
        setVenues(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch venues");
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AttendeeHeader /> {/* Replace with general Header if needed */}

      <div className="ml-64 p-8 mt-16">
        <h2 className="text-2xl font-bold mb-6 text-rose-700">
          Available Venues
        </h2>

        {message && (
          <div className="mb-4 p-3 text-sm text-red-800 bg-red-100 rounded-md">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col"
            >
              {venue.image && (
                <img
                  src={`http://localhost:5000/uploads/${venue.image}`}
                  alt={venue.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <h3 className="text-lg font-semibold">{venue.name}</h3>
              <p className="text-gray-600">Location: {venue.location}</p>
              <p className="text-gray-600">Capacity: {venue.capacity}</p>
              <p className="text-gray-600">Price/hr: Rs.{venue.price}</p>
              <p className="text-gray-600">Contact: {venue.contact}</p>
              <p className="text-gray-600">
                Availability: {venue.availability ? "Yes" : "No"}
              </p>

              {/* Optional: You can add a "Book" button here for attendees */}
              {/* {venue.availability && (
                <button
                  className="mt-3 bg-green-600 text-white py-1 rounded hover:bg-green-700 transition"
                >
                  Book
                </button>
              )} */}
                <button
                  className="mt-3 bg-rose-500 text-white py-1 rounded hover:bg-rose-600 transition"
                  onClick={() => navigate(`/venue/detail/${venue.id}`)}
                >
                  View Details
                </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
