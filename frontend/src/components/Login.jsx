import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage("✅ Login successful! Redirecting...");

      const role = res.data.user.role;
      if (role === "organizer") {
        window.location.href = "/dashboard/Organizer";
      } else {
        window.location.href = "/dashboard/Attendee";
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div
  className="relative flex items-center  justify-center min-h-screen bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://content.jdmagicbox.com/comp/wayanad/v4/9999p4936.4936.240110150316.t6v4/catalogue/manavatty-decorations-muttil-wayanad-generators-on-rent-79wmfafy0m.jpg')",
  }}
>
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-black opacity-50 -z-10"></div>

      <Header />
      <div className="w-full max-w-md bg-white backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center z-10">
        <h2 className="text-3xl font-bold text-pink-600 mb-6">Login</h2>

        {message && (
          <p
            className={`mb-4 text-sm font-medium ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-pink-600 font-bold hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
