const Booking = require("../Model/villaBookingModel");
const mongoose = require("mongoose");

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ startDate: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Get single booking by ID
exports.getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { villaId, villaName, customerName, startDate, endDate, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(villaId)) {
      return res.status(400).json({ error: "Invalid villaId format" });
    }

    const newBooking = new Booking({
      villaId,
      villaName,
      customerName,
      startDate,
      endDate,
      notes,
    });

    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a booking
exports.updateBooking = async (req, res) => {
  try {
    const { villaId, villaName, customerName, startDate, endDate, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(villaId)) {
      return res.status(400).json({ error: "Invalid villaId format" });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { villaId, villaName, customerName, startDate, endDate, notes },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Booking not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// ==================== FIXED: Get monthly bookings for a villa ====================
exports.getMonthlyVillaBookings = async (req, res) => {
  try {
    const { villaName, month, year } = req.query;
    
    console.log("Monthly Report Request:", { villaName, month, year }); // Debug log
    
    if (!villaName || !month || !year) {
      return res.status(400).json({ 
        error: "Missing required parameters: villaName, month, year" 
      });
    }

    const selectedMonth = parseInt(month);
    const selectedYear = parseInt(year);
    
    // Validate month and year
    if (selectedMonth < 1 || selectedMonth > 12) {
      return res.status(400).json({ error: "Invalid month" });
    }
    if (selectedYear < 2020 || selectedYear > 2030) {
      return res.status(400).json({ error: "Invalid year" });
    }

    // Create date range for the selected month
    const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

    console.log("Date Range:", { startOfMonth, endOfMonth }); // Debug log

    // Find bookings that overlap with the selected month
    const bookings = await Booking.find({
      villaName: villaName,
      $or: [
        // Bookings that start in the month
        { 
          startDate: { 
            $gte: startOfMonth, 
            $lte: endOfMonth 
          } 
        },
        // Bookings that end in the month
        { 
          endDate: { 
            $gte: startOfMonth, 
            $lte: endOfMonth 
          } 
        },
        // Bookings that span across the month
        {
          startDate: { $lte: startOfMonth },
          endDate: { $gte: endOfMonth }
        }
      ]
    }).sort({ startDate: 1 });

    console.log("Found bookings:", bookings.length); // Debug log

    res.json(bookings);
  } catch (err) {
    console.error("Monthly bookings error:", err);
    res.status(500).json({ 
      error: "Failed to fetch monthly bookings",
      details: err.message 
    });
  }
};