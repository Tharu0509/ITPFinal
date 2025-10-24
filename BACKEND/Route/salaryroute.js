const express = require("express");
const router = express.Router();

// Model (Optional here if not used directly)
const Salary = require("../Model/salarymodel");

// Controller
const salaryControl = require("../Controllers/salarycontroller");

// Routes
router.get("/", salaryControl.getAllSalary);       // Get all salary
router.post("/", salaryControl.addSalary);         // Add new salary
router.get("/:id", salaryControl.getById);             // Get salary by ID
router.put("/:id", salaryControl.updateSalary);    // Update salary by ID
router.delete("/:id", salaryControl.deleteSalary); // Delete salary by ID

// Export router
module.exports = router;
