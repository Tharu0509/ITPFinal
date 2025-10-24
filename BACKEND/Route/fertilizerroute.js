const express = require("express");
const router = express.Router();

// Model (Optional here if not used directly)
const Fertilizer = require("../Model/fertilizermodel");

// Controller
const fertilizerControl = require("../Controllers/fertilizercontrol");

// Routes
router.get("/", fertilizerControl.getAllFertilizer);       // Get all fertilizers
router.post("/", fertilizerControl.addFertilizer);         // Add new fertilizer
router.get("/:id", fertilizerControl.getById);             // Get fertilizer by ID
router.put("/:id", fertilizerControl.updateFertilizer);    // Update fertilizer by ID
router.delete("/:id", fertilizerControl.deleteFertilizer); // Delete fertilizer by ID

// Export router
module.exports = router;
