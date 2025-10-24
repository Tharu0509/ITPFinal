const express = require("express");
const router = express.Router();
const {
  getBookings,
  getSingleBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getMonthlyVillaBookings,
} = require("../Controllers/bookingController");

// IMPORTANT: Put this route BEFORE the /:id route to avoid conflicts
router.get("/report/monthly", getMonthlyVillaBookings);

// CRUD routes
router.get("/", getBookings);
router.get("/:id", getSingleBooking);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;