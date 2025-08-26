const path = require("path");
const fs = require("fs");
const { User, Venue, Booking } = require("../models");

// Create Venue (Organizer only)
exports.addVenue = async (req, res) => {
  try {
    const { name, location, capacity, price, contact,breakfastPrice, lunchPrice, mealPrice } = req.body;
    const organizerId = req.user.id;
    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    const venue = await Venue.create({
      name,
      location,
      capacity,
      price,
      contact,
      image,
      organizerId,
      availability: true,
      breakfastPrice,
      lunchPrice,
      mealPrice, // default availability yes
    });

    res.status(201).json({
      message: "Venue added successfully",
      venue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteVenue = async (req, res) => {
  try {
    const venueId = req.params.id;
    const userId = req.user.id; // organizer id from auth middleware

    // Find the venue
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Only the organizer who created the venue can delete
    if (venue.organizerId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this venue" });
    }

    await venue.destroy();

    res.json({ message: "Venue deleted successfully" });
  } catch (err) {
    console.error("Error deleting venue:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Get all venues
exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll({
      order: [["id", "DESC"]],
    });
    res.status(200).json(venues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch venues" });
  }
};

// Get a single venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    res.status(200).json(venue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Venue (Organizer only)
exports.updateVenue = async (req, res) => {
  try {
    const venueId = req.params.id;
    const { name, location, capacity, price, contact, availability, breakfastPrice, lunchPrice, mealPrice  } = req.body;

    const venue = await Venue.findByPk(venueId);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    // Optional: check organizer ownership
    if (venue.organizerId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this venue" });
    }

    // Handle image update
    let image = venue.image; // keep previous if no new image
    if (req.file) {
      if (venue.image) {
        const oldImagePath = path.join(__dirname, "..", "uploads", venue.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      image = req.file.filename;
    }

    // Update venue
    await venue.update({
      name,
      location,
      capacity,
      price,
      contact,
      availability: availability === "true" || availability === true,
       breakfastPrice, lunchPrice, mealPrice,
      image,
    });

    res.status(200).json({
      message: "Venue updated successfully",
      venue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
