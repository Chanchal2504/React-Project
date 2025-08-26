const User = require("./User");
const Venue = require("./venues");
const Booking = require("./bookings");
const sequelize = require("../config/db");

// Associations
Venue.belongsTo(User, { foreignKey: "organizerId", as: "organizer" });
Venue.hasMany(Booking, { foreignKey: "venueId", as: "bookings" });

Booking.belongsTo(User, { foreignKey: "attendeeId", as: "attendee" });
Booking.belongsTo(Venue, { foreignKey: "venueId", as: "venue" });

module.exports = { sequelize,User, Venue, Booking };
