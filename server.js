// ✅ server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Compass connection
mongoose.connect("mongodb://127.0.0.1:27017/tripjoy", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    gender: String,
    dob: String,
    password: String
});
const User = mongoose.model("User", userSchema);

// Train Schema
const trainSchema = new mongoose.Schema({
    from: String,
    to: String,
    type: String,
    trainName: String,
    trainNumber: String,
    classes: mongoose.Schema.Types.Mixed
});
const Train = mongoose.model("Train", trainSchema);

// Bus Schema
const busSchema = new mongoose.Schema({
    busNumber: String,
    operator: String,
    from: String,
    to: String,
    departureTime: String,
    arrivalTime: String,
    type: String,
    fare: Number,
    seatsAvailable: Number
});
const Bus = mongoose.model("Bus", busSchema);

// ---------------- Routes ---------------- //

// Register Route
app.post("/register", async (req, res) => {
    const { firstName, lastName, email, gender, dob, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, gender, dob, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({ message: `Welcome ${user.firstName}!` });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Search Trains Route
app.get("/search-trains", async (req, res) => {
    const { from, to, class: travelClass } = req.query;

    try {
        const trains = await Train.find({
            from: { $regex: new RegExp(from, "i") },
            to: { $regex: new RegExp(to, "i") },
            [`classes.${travelClass.toUpperCase()}`]: { $exists: true }
        });

        res.json(trains);
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "Failed to search trains" });
    }
});

// Search Buses Route
app.post("/api/buses/search", async (req, res) => {
    const { from, to } = req.body;

    try {
        const buses = await Bus.find({
            from: { $regex: new RegExp(from, "i") },
            to: { $regex: new RegExp(to, "i") }
        });
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// flight search API
app.get('/api/flights', async (req, res) => {
  const { from, to, userDate } = req.query;

  try {
    const flights = await Flight.find({
      from: { $regex: new RegExp(from, 'i') },
      to: { $regex: new RegExp(to, 'i') }
    });

    const results = flights.map(flight => ({
      ...flight.toObject(),
      userDate: userDate // Attach the user-entered date to each result
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Flight search failed.' });
  }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
