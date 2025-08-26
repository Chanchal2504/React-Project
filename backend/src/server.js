const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const VenueRoutes = require("./routes/venueRoutes");
const Booking = require("./models/bookings");
const BookingRoutes = require("./routes/booking");
// const eventRoutes = require("./routes/events")
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => res.send("Event Platform API running..."));
app.use("/api/auth", authRoutes);
app.use("/api/venue",VenueRoutes);
app.use("/api",BookingRoutes)
// app.use("/api/events", eventRoutes);


sequelize.sync({ alter: true }) // use { force: true } to drop & recreate tables
  .then(() => console.log("✅ Database synced with Sequelize models"))
  .catch(err => console.error("❌ Sync error:", err));

// Test DB connection
// sequelize.authenticate()
//   .then(() => console.log("✅ MySQL connected successfully"))
//   .catch((err) => console.error("❌ DB connection error:", err));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
