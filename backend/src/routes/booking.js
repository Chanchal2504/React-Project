const express = require("express");
const router = express.Router();
const { createBooking,getUserBookings,getOrganizerBookings,updateBookingStatus } = require("../controlller/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/bookings", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getUserBookings);
router.get("/organizer-bookings", authMiddleware, getOrganizerBookings);
router.put("/booking/:bookingId/status", authMiddleware, updateBookingStatus);

module.exports = router;
