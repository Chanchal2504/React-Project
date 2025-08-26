import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import AttendeeDashboard from "./components/AttendeeDashboard";
import OrganizerDashboard from "./components/OrganizerDashboard";
import AddVenue from "./components/AddVenue"
import HomePage from "./components/HomePage"
import ViewVenues from "./components/ViewVenues";
import EditVenue from "./components/EditVenue";
import ViewVenuesAttendee from "./components/ViewVenueAttendee";
import VenueDetails from "./components/VenueDetails";
import BookingHistory from "./components/BookingHistory";
import OrganizerBookings from "./components/ViewBookings";
import ViewRequests from "./components/ViewRequests";

function App() {
  return (
    <Router>
      {/* <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/Attendee" element={<AttendeeDashboard />} />
        <Route path="/dashboard/Organizer" element={<OrganizerDashboard />} />
        <Route path="/venue/add" element={<AddVenue />} />
        <Route path="/venue/viewall" element={<ViewVenues />} />
        <Route path="/venue/edit/:id" element={<EditVenue />} />
        <Route path="/venue/all" element={<ViewVenuesAttendee />} />
        <Route path="/venue/detail/:id" element={<VenueDetails />} />
        <Route path="/venue/bookinghistory" element={<BookingHistory />} />
        <Route path="/venue/viewbookings" element={<OrganizerBookings />} />
        <Route path="venue/viewrequests" element={<ViewRequests />} />
        


      </Routes>
    </Router>
  );
}

export default App;
