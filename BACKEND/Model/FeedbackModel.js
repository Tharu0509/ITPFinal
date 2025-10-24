const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false }, // 🔑 used for ownership check
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
