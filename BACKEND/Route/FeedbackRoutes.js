const express = require("express");
const router = express.Router();
const {
  getFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../Controllers/FeedbackControllers");

// Routes
router.get("/", getFeedbacks);         // GET all feedback
router.get("/:id", getFeedbackById);   // GET feedback by ID
router.post("/", createFeedback);      // POST new feedback
router.put("/:id", updateFeedback);    // PUT update feedback (only owner)
router.delete("/:id", deleteFeedback); // DELETE feedback (only owner)

module.exports = router;
