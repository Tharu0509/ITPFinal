// Routes/employeeRoutes.js
const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeByEmployeeId,
  updateEmployee,
  deleteEmployee,
  getEmployeesWithAttendance,
  getEmployeesWithAttendanceByMonth,
} = require("../Controllers/employeeController");

const router = express.Router();

// ✅ Create employee
router.post("/", createEmployee);

// ✅ List employees (with search & pagination)
router.get("/", getEmployees);

router.get("/with-attendance/:date", getEmployeesWithAttendance);

router.get("/with-attendance/:year/:month", getEmployeesWithAttendanceByMonth);

// ✅ Get employee by MongoDB _id
router.get("/:id", getEmployeeById);

// ✅ Get employee by Admin-assigned employeeId
router.get("/by-employee-id/:employeeId", getEmployeeByEmployeeId);

// ✅ Update employee by _id
router.put("/:id", updateEmployee);

// ✅ Delete employee by _id
router.delete("/:id", deleteEmployee);

module.exports = router;
