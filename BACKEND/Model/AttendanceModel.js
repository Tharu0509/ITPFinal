const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee_Name: {
    type: String,
    required: true,
  },

  employee_ID: {   // fixed spelling
    type: String,
    required: true,
  },

  Date: {
    type: Date,
    required: true,
  },

  Check_in_Time: {
    type: String,   // changed to String, since form sends "08:00"
    required: true,
  },

  Check_out_Time: {
    type: String,   // changed to String
    required: true,
  },

  Total_hours_Worked: {
    type: String,
    required: true,
  },

  Shift_Time: {
    type: String,
    required: true,
  },

  attendance_status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("AttendanceModel", attendanceSchema);
