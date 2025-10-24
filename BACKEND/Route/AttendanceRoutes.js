const express = require("express");
const router = express.Router();
//Insert Model
//const Attendance = require("../Model/AttendanceModel");
//Insert attendance controller 
const AttendanceController = require("../Controllers/AttendanceControllers");

router.get("/search",AttendanceController.searchAttendances);

router.get("/",AttendanceController.getAllAttendances);
router.post("/",AttendanceController.addAttendances);
router.get("/:id",AttendanceController.getById);
router.put("/:id",AttendanceController.updateAttendance);
router.delete("/:id",AttendanceController.deleteAttendance);

//export
module.exports = router;

