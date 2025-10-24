const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  villaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Villa",
    required: true,
  },
  villaName: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
