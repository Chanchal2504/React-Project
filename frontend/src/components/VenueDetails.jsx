import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AttendeeHeader from "./AttendeeHeader";

export default function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCostOpen, setIsCostOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null); 

  const [bookingData, setBookingData] = useState({
    eventName: "",  // <-- added event name
    name: "",
    email: "",
    date: "",
    attendees: "",
    startTime: "",
    endTime: "",
    meals: { breakfast: false, lunch: false, dinner: false },
    // totalCost:calculatedCost.total,
  });

  useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        window.location.href = "/login"; // redirect if not logged in
      } else {
        setUser(storedUser);
      }
    }, []);


  // 📌 Handle booking confirmation
  const handleBookSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token"); 
    if (!token) {
      alert("You must be logged in to book a venue.");
      return;
    }

    if (!calculatedCost) {
      alert("Please calculate cost before booking.");
      return;
    }

    const payload = {
      venueId: id,
      attendeeId: user.id,
      eventName: bookingData.eventName,
      name: bookingData.name,
      email: bookingData.email,
      date: bookingData.date,
      attendees: bookingData.attendees,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,

      // ✅ flatten meals
      breakfast: bookingData.meals.breakfast,
      lunch: bookingData.meals.lunch,
      dinner: bookingData.meals.dinner,

      // ✅ include total (venue + meals)
      totalCost: calculatedCost.total,
    };

    console.log("📦 Sending booking data:", payload);

    await axios.post("http://localhost:5000/api/bookings", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert(`Booking confirmed for ${bookingData.eventName}`);
    setIsBookingOpen(false);
    setIsCostOpen(false);
    setBookingData({
      eventName: "",
      name: "",
      email: "",
      date: "",
      attendees: "",
      startTime: "",
      endTime: "",
      meals: { breakfast: false, lunch: false, dinner: false },
    });
  } catch (err) {
  console.error("❌ Booking error:", err.response?.data || err.message, err);

  // show backend message in popup
  if (err.response && err.response.data && err.response.data.message) {
    alert(err.response.data.message);
  } else {
    alert("Booking failed, please try again.");
  }
}

};

// 📌 Calculate cost
  const [calculatedCost, setCalculatedCost] = useState(null);
    const handleGetCost = () => {
    if (!formData) return;

    const hours =
      bookingData.startTime && bookingData.endTime
        ? (new Date(`1970-01-01T${bookingData.endTime}:00`) -
            new Date(`1970-01-01T${bookingData.startTime}:00`)) /
          (1000 * 60 * 60)
        : 1;

    const attendees = parseInt(bookingData.attendees) || 0;
    const baseCost = formData.price * hours;
    let mealCost = 0;

    if (bookingData.meals.breakfast)
      mealCost += (formData.breakfastPrice || 0) * attendees;
    if (bookingData.meals.lunch)
      mealCost += (formData.lunchPrice || 0) * attendees;
    if (bookingData.meals.dinner)
      mealCost += (formData.mealPrice || 0) * attendees;

    const total = baseCost + mealCost;
    setCalculatedCost({ baseCost, mealCost, total, hours, attendees });
    console.log(setCalculatedCost)
    setIsCostOpen(true);
  };

  // 📌 Fetch venue data
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
          image: res.data.image
            ? `http://localhost:5000/uploads/${res.data.image}`
            : null,
          breakfastPrice: res.data.breakfastPrice || 0,
          lunchPrice: res.data.lunchPrice || 0,
          mealPrice: res.data.mealPrice || 0,
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch venue data");
      }
    };
    fetchVenue();
  }, [id]);

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AttendeeHeader />
        <div className="ml-64 p-8 mt-16 text-center">
          {message ? <p>{message}</p> : <p>Loading venue details...</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AttendeeHeader />

      <div className="ml-64 p-8 mt-16 max-w-3xl mx-auto">
        {/* Venue Image */}
        {formData.image && (
          <img
            src={formData.image}
            alt={formData.name}
            className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
          />
        )}

        {/* Venue Details */}
        <h2 className="text-3xl font-bold mb-4 text-rose-700">
          {formData.name}
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> {formData.location}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Capacity:</strong> {formData.capacity}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Price per hour:</strong> Rs.{formData.price}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Contact:</strong> {formData.contact}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Availability:</strong>{" "}
          {formData.availability ? "Yes" : "No"}
        </p>

        {/* Book Button */}
        {formData.availability ? (
          <button
            onClick={() => setIsBookingOpen(true)}
            className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition"
          >
            Book
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
          >
            Not Available
          </button>
        )}
      </div>

      {/* Booking Form Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">Book {formData.name}</h3>
            <form className="space-y-4">
              {/* Event Name */}
              <input
                type="text"
                placeholder="Event Name"
                className="w-full border rounded px-3 py-2"
                value={bookingData.eventName}
                onChange={(e) =>
                  setBookingData({ ...bookingData, eventName: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded px-3 py-2"
                value={bookingData.name}
                onChange={(e) =>
                  setBookingData({ ...bookingData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border rounded px-3 py-2"
                value={bookingData.email}
                onChange={(e) =>
                  setBookingData({ ...bookingData, email: e.target.value })
                }
                required
              />
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={bookingData.date}
                onChange={(e) =>
                  setBookingData({ ...bookingData, date: e.target.value })
                }
                required
              />
              <input
                type="time"
                className="w-full border rounded px-3 py-2"
                value={bookingData.startTime}
                onChange={(e) =>
                  setBookingData({ ...bookingData, startTime: e.target.value })
                }
                required
              />
              <input
                type="time"
                className="w-full border rounded px-3 py-2"
                value={bookingData.endTime}
                onChange={(e) =>
                  setBookingData({ ...bookingData, endTime: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Number of Attendees"
                className="w-full border rounded px-3 py-2"
                value={bookingData.attendees}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    attendees: e.target.value,
                  })
                }
                required
              />

              {/* Meals Selection */}
              <div>
                <label className="block font-semibold mb-1">Meals:</label>
                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={bookingData.meals.breakfast}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          meals: {
                            ...bookingData.meals,
                            breakfast: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Breakfast (Rs.{formData.breakfastPrice})
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={bookingData.meals.lunch}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          meals: {
                            ...bookingData.meals,
                            lunch: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Lunch (Rs.{formData.lunchPrice})
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={bookingData.meals.dinner}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          meals: {
                            ...bookingData.meals,
                            dinner: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Dinner (Rs.{formData.mealPrice})
                  </label>
                </div>
              </div>

              {/* Get Cost Button */}
              <button
                type="button"
                onClick={handleGetCost}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Cost
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cost Popup */}
      {isCostOpen && calculatedCost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsCostOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">Booking Cost</h3>
            <p><strong>Event Name:</strong> {bookingData.eventName}</p>
            <p><strong>Venue Cost ({calculatedCost.hours} hrs):</strong> Rs.{calculatedCost.baseCost}</p>
            <p><strong>Meal Cost:</strong> Rs.{calculatedCost.mealCost}</p>
            <p><strong>Total Attendees:</strong> {calculatedCost.attendees}</p>
            <hr className="my-2" />
            <p className="text-xl font-bold">Total: Rs.{calculatedCost.total}</p>

            <button
              onClick={handleBookSubmit}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
