import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header2 from "./AttendeeHeader"

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    capacity: "",
    description: "",
    category_id: "2",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/events", formData);
      // setMessage(res.data.message || "Registered successfully!");
    } catch (err) {
      // setMessage(err.response?.data?.message || "Something went wrong");
    }
    alert("Event created successfully!");
    navigate("/dashboard/Organizer"); // redirect back
  };

  return (
    <>
    <Header2/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-xl mt-20 p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div>
            <label className="block text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          

          {/* Location */}
          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. City Hall, New York"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="number"
            placeholder="Breakfast Price per Person"
            value={formData.breakfastPrice}
            onChange={(e) => setFormData({ ...formData, breakfastPrice: e.target.value })}
          />

          <input
            type="number"
            placeholder="Lunch Price per Person"
            value={formData.lunchPrice}
            onChange={(e) => setFormData({ ...formData, lunchPrice: e.target.value })}
          />

          <input
            type="number"
            placeholder="Meal Price per Person"
            value={formData.mealPrice}
            onChange={(e) => setFormData({ ...formData, mealPrice: e.target.value })}
          />
          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/organizer-dashboard")}
              className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default CreateEvent;