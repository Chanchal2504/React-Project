const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  addVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue, // make sure you import this
} = require("../controlller/venueController");
const authMiddleware = require("../middleware/authMiddleware");

// Test route
router.get("/test", (req, res) => res.send("Venue route working"));

// Create a venue (Organizer only)
router.post("/add", authMiddleware, upload.single("image"), addVenue);

// Get all venues
router.get("/all", getAllVenues);

// Get a single venue by ID
router.get("/:id", getVenueById);
router.delete("/:id", authMiddleware, deleteVenue);
// Update a venue (Organizer only)
router.put("/:id", authMiddleware, upload.single("image"), updateVenue);

module.exports = router;
