const Feedback = require("../Model/FeedbackModel");
const User = require("../Model/SitharaUserRegModel");
const mongoose = require("mongoose");

// ✅ Get all feedback
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

// ✅ Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

// ✅ Add new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;

    if (!userId || !rating) {
      return res.status(400).json({ error: "User ID and rating are required" });
    }

    const user = await User.findById(userId).select("name email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const feedback = new Feedback({
      userId,
      name: user.name,
      email: user.email,
      rating,
      comment: comment || "", 
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
};

// ✅ Update feedback (only owner)
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, rating, comment } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });

    // 🔒 Ownership check
    if (feedback.email !== email) {
      return res
        .status(403)
        .json({ error: "You can only edit your own feedback" });
    }

    feedback.name = name || feedback.name;
    feedback.rating = rating || feedback.rating;
    feedback.comment = comment || feedback.comment;
    await feedback.save();

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// ✅ Delete feedback (only owner)
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body; // frontend must send user email

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });

    // 🔒 Ownership check
    if (feedback.email !== email) {
      return res
        .status(403)
        .json({ error: "You can only delete your own feedback" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
