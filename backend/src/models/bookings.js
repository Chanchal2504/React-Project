const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define(
  "Booking",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attendeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // New field for event name
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: { type: DataTypes.DATEONLY, allowNull: false }, // YYYY-MM-DD
    startTime: { type: DataTypes.TIME, allowNull: false }, // HH:MM:SS
    endTime: { type: DataTypes.TIME, allowNull: false },

    attendees: { type: DataTypes.INTEGER, allowNull: false }, // number of attendees

    // Meals selection
    breakfast: { type: DataTypes.BOOLEAN, defaultValue: false },
    lunch: { type: DataTypes.BOOLEAN, defaultValue: false },
    dinner: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Cost storage
    totalCost: { type: DataTypes.FLOAT, allowNull: false },

    status: {
      type: DataTypes.ENUM("Booked", "Cancelled","Requested","Completed"),
      defaultValue: "Requested",
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
  }
);

module.exports = Booking;
