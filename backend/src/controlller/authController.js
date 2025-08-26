const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
exports.register = async (req, res) => {
  try {
    console.log("REQ.FILE:", req.file); // check the whole object
    if (req.file) {
      console.log("Uploaded filename:", req.file.filename); // prints just the filename
    }
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const finalpassword = password;
    // let imagePath = null;
    // if (req.file) {
    //   imagePath = req.file.filename;  // stored in /uploads/filename.png
    // }

    let imagePath = null;
    
    try {
      if (req.file) {
        
        imagePath = req.file.filename; // only save filename
      }
    } catch (err) {
      console.error("Image upload error:", err.message);
      return res.status(400).json({ message: "Error handling image upload" });
    }
    // Create user (default role = "attendee")
    const user = await User.create({
      name,
      email,
      password: finalpassword,
      role: role || "attendee",
      image: imagePath
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    console.log("User found in DB:", user ? user.toJSON() : null);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    console.log("Password check:", password === user.password);
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Handle image
    let finalImage = null;
    try {
      if (user.image) {
        finalImage = `http://localhost:5000/uploads/${user.image}`;
      }
    } catch (err) {
      console.error("Image fetch error:", err.message);
      finalImage = null;
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: finalImage
      },
    });
  } catch (err) {
    console.error("Login error caught:", err);
    res.status(500).json({ message: "❌ Login failed due to server error", error: err.message });
  }
};

