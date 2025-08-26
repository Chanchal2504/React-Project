const { Op } = require("sequelize");
const { User, Venue, Booking } = require("../models");

const createBooking = async (req, res) => {
    console.log("Control is here");
  try {
    const {
      venueId,
      eventName,
      date,
      startTime,
      endTime,
      attendees,
      breakfast: breakfastBool,
      lunch: lunchBool,
      dinner: dinnerBool,
      
    } = req.body;

    const attendeeId = req.user.id; // assuming logged-in user from authMiddleware
// console.log("Control is here");
    // 1️⃣ Get venue details
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const conflict = await Booking.findOne({
      where: {
        venueId,
        date, // same date
        [Op.or]: [
          {
            startTime: { [Op.between]: [startTime, endTime] },
          },
          {
            endTime: { [Op.between]: [startTime, endTime] },
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gte]: endTime } },
            ],
          },
        ],
      },
    });

    if (conflict) {
  return res.status(400).json({ message: "This time slot is already booked.Try for another time slot" });
}


    // 2️⃣ Calculate costs
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    let durationHours = Math.abs((end - start) / (1000 * 60 * 60)); // convert ms → hours
    if (durationHours < 1) durationHours = 1; // minimum 1 hour

    // 4️⃣ Calculate costs
    let totalCost = durationHours * venue.price; // base price × hours

    if (breakfastBool) {
      totalCost += venue.breakfastPrice * attendees;
    }
    if (lunchBool) {
      totalCost += venue.lunchPrice * attendees;
    }
    if (dinnerBool) {
      totalCost += venue.mealPrice * attendees;
    }
console.log(totalCost)
    // 3️⃣ Save booking
    const booking = await Booking.create({
      venueId,
      attendeeId,
      eventName,
      date,
      startTime,
      endTime,
      attendees,
      breakfast: breakfastBool,
      lunch: lunchBool,
      dinner: dinnerBool,
      totalCost, // ✅ store calculated total cost
    });
        await Venue.update(
    { availability: "no" }, // or availability: false (depends on your model)
    { where: { id: venueId } }
    );

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserBookings = async (req, res) => {
    console.log("In controller")
  try {
    const userId = req.user.id; // from authMiddleware

    const bookings = await Booking.findAll({
      where: { attendeeId: userId },
      include: [
        { model: Venue, as: "venue" }, // ⚠️ must match the alias exactly
      ],
      order: [["date", "DESC"]],
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Organizer view: get all bookings for their venues
const getOrganizerBookings = async (req, res) => {
  try {
    const organizerId = req.user.id; // logged-in organizer

    // 1️⃣ Update past bookings to "completed" if still booked
    await Booking.update(
      { status: "completed" },
      {
        where: {
          date: { [Op.lt]: new Date() },
          status: "booked",
        },
        include: [
          {
            model: Venue,
            as: "venue",
            where: { organizerId },
          },
        ],
      }
    );

    // 2️⃣ Get bookings for venues owned by this organizer
    const bookings = await Booking.findAll({
      include: [
        {
          model: Venue,
          as: "venue",
          where: { organizerId }, // only this organizer's venues
        },
        {
          model: User,
          as: "attendee",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json({ bookings });
  } catch (err) {
    console.error("Error fetching organizer bookings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // "booked" or "cancelled"

    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Venue, as: "venue" }],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Organizer can only update their own venue bookings
    if (booking.venue.organizerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent status changes if already completed or cancelled
    if (
      (booking.status === "completed" && status !== "completed") ||
      (booking.status === "cancelled" && status !== "cancelled")
    ) {
      return res.status(400).json({ message: "Cannot change status from completed/cancelled" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status}`, booking });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




module.exports = { createBooking, getUserBookings, getOrganizerBookings, updateBookingStatus  };
