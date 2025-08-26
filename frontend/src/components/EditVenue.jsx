import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import OrganizerHeader from "./OrganizerHeader";

export default function EditVenue() {
  const { id } = useParams(); // venue ID from URL
  const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    price: "",
    contact: "",
    availability: true,
    breakfastPrice:"",
   lunchPrice:"",
    mealPrice:"" ,
    image: null,
  });
  const [message, setMessage] = useState("");
  const [existingImage, setExistingImage] = useState(null); // add this
  // Fetch venue data by ID
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/venue/${id}`);
        setFormData({
          name: res.data.name,
          location: res.data.location,
          capacity: res.data.capacity,
          price: res.data.price,
          contact: res.data.contact,
          availability: res.data.availability,
          breakfastPrice:res.data.breakfastPrice,
          lunchPrice:res.data.lunchPrice,
          mealPrice:res.data.mealPrice,
          image: null,
        });
        setExistingImage(res.data.image ? `http://localhost:5000/uploads/${res.data.image}` : null);
        console.log(`Image:-${res.data.image}`)
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch venue data");
      }
    };
    fetchVenue();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("location", formData.location);
      data.append("capacity", formData.capacity);
      data.append("price", formData.price);
      data.append("contact", formData.contact);
      data.append("availability", formData.availability);
      data.append("breakfastPrice", formData.breakfastPrice);
      data.append("lunchPrice", formData.lunchPrice);
      data.append("mealPrice", formData.mealPrice);


      if (formData.image) data.append("image", formData.image);
      const token = localStorage.getItem("token"); // organizer token

      const res = await axios.put(`http://localhost:5000/api/venue/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message || "Venue updated successfully!");
      navigate("/venue/viewall"); // redirect to all venues page
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <OrganizerHeader />
      <div className="ml-64 p-8 mt-16 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-rose-700">Edit Venue</h2>
        {message && <p className="mb-4 text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Venue Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="breakfastPrice"
            value={formData.breakfastPrice}
            onChange={handleChange}
            placeholder="Breakfast Price per person"
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="lunchPrice"
            value={formData.lunchPrice}
            onChange={handleChange}
            placeholder="Lunch Price per person"
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="mealPrice"
            value={formData.mealPrice}
            onChange={handleChange}
            placeholder="Meal/Dinner Price per person"
            className="w-full p-2 border rounded"
          />
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="w-full p-2 border rounded"
            required
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            <span>Available</span>
          </label>

            {existingImage && (
                <div className="mb-2 flex">
                    <img
                    src={existingImage}
                    onClick={() => setIsOpen(true)}
                    alt="Existing Venue"
                    className="w-10 h-10 object-cover rounded-md"
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
            )}
            {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="bg-white full p-1 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking the circle
              >
                <img
                  src={existingImage} // corrected here
                  alt="Profile"
                  className="w-128 h-96 full object-cover"
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-rose-600 text-white p-2 rounded hover:bg-rose-700"
          >
            Update Venue
          </button>
        </form>
      </div>
    </div>
  );
}
