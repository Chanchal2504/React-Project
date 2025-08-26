import React, { useEffect, useState } from "react";
import axios from "axios";
import OrganizerHeader from "./OrganizerHeader";
import { useNavigate } from "react-router-dom";

export default function ViewVenues() {
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch all venues for this organizer
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/venue/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Optional: filter only organizer's venues
        const user = JSON.parse(localStorage.getItem("user"));
        const organizerVenues = res.data.filter(
          (v) => v.organizerId === user.id
        );

        setVenues(organizerVenues);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch venues");
      }
    };

    fetchVenues();
  }, []);

  const handleEdit = (venueId) => {
    navigate(`/venue/edit/${venueId}`);
  };
  const handleDelete = async (venueId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/venue/${venueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted venue from local state
      setVenues((prev) => prev.filter((v) => v.id !== venueId));
      setMessage("Venue deleted successfully");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete venue");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <OrganizerHeader />

      <div className="ml-64 p-8 mt-16">
        <h2 className="text-2xl font-bold mb-6 text-rose-600">
          Your Venues
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
              <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(venue.id)}
                className="mt-3 bg-green-600 w-full text-white py-1 rounded hover:bg-green-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(venue.id)}
                className="mt-3 bg-red-600 text-white w-full py-1 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
