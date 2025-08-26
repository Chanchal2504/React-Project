import React, { useState } from "react";
import axios from "axios";
import OrganizerHeader from "./OrganizerHeader";

export default function AddVenue() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    price: "",
    contact: "",
    image: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("I am here")

    // Prepare FormData
    const data = new FormData();
    data.append("name", formData.name);
    data.append("location", formData.location);
    data.append("capacity", formData.capacity);
    data.append("price", formData.price);
    data.append("contact", formData.contact);
    if (formData.image) {
        data.append("image", formData.image);
        console.log("Image file:", formData.image);
    }

    console.log("FormData prepared:", formData);

    try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);

        const res = await axios.post("http://localhost:5000/api/venue/add", data, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
        });

        console.log("Response from server:", res.data);
        setMessage(res.data.message || "Venue added successfully!");

        // Reset form
        setFormData({
        name: "",
        location: "",
        capacity: "",
        price: "",
        contact: "",
        image: null,
        });
    } catch (err) {
        console.error("Error during venue submission:", err);
        console.log("Error response data:", err.response?.data);
        setMessage(err.response?.data?.message || "Something went wrong");
    }
    };


  return (
    <div className="min-h-screen flex bg-gray-100">
      <OrganizerHeader />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-rose-600">
            Add Venue
          </h2>

          {message && (
            <div className="mb-4 p-3 text-sm text-blue-800 bg-blue-100 rounded-md">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Venue Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="number"
              name="price"
              placeholder="Price per hour"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Add Venue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
