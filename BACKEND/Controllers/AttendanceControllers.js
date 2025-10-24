const Attendance = require("../Model/AttendanceModel");

const getAllAttendances = async (req, res, next) => {
  let attendances;
  try {
    attendances = await Attendance.find();
  } catch (err) {
    console.log(err);
  }

  if (!attendances) {
    return res.status(404).json({ message: "Attendances not found" });
  }

  return res.status(200).json({ attendances });
};

const addAttendances = async (req, res, next) => {
  const {
    employee_Name,
    employee_ID,
    Date,
    Check_in_Time,
    Check_out_Time,
    Total_hours_Worked,
    Shift_Time,
    attendance_status,
  } = req.body;

  let attendances;

  try {
    attendances = new Attendance({
      employee_Name,
      employee_ID,
      Date,
      Check_in_Time,
      Check_out_Time,
      Total_hours_Worked,
      Shift_Time,
      attendance_status,
    });

    await attendances.save();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error adding attendance", error: err.message });
  }

  if (!attendances) {
    return res.status(400).json({ message: "Unable to add attendance" });
  }

  return res.status(201).json({ attendances });
};

//Get by ID
const getById = async (req, res, next) => {
  const id = req.params.id;

  let attendance;

  try {
    attendance = await Attendance.findById(id);
  } catch (err) {
    console.log(err);
  }

  //not available attendances
  if (!attendance) {
    return res.status(404).json({ message: "Attendances not found " });
  }
  return res.status(200).json({ attendance });
};

//Update Attendances Details
const updateAttendance = async (req, res, next) => {
  const id = req.params.id;
  const {
    employee_Name,
    emplotee_ID,
    Date,
    Check_in_Time,
    Check_out_Time,
    Total_hours_Worked,
    Shift_Time,
    attendance_status,
  } = req.body;

  let attendances;

  try {
    attendances = await Attendance.findByIdAndUpdate(id, {
      employee_Name: employee_Name,
      emplotee_ID: emplotee_ID,
      Date: Date,
      Check_in_Time: Check_in_Time,
      Check_out_Time: Check_out_Time,
      Total_hours_Worked: Total_hours_Worked,
      Shift_Time: Shift_Time,
      attendance_status: attendance_status,
    });
    attendances = await attendances.save();
  } catch (err) {
    console.log(err);
  }
  //not available attendances
  if (!attendances) {
    return res
      .status(404)
      .json({ message: "Unable to update Attendance Details " });
  }
  return res.status(200).json({ attendances });
};

//Delete Attendance Details
const deleteAttedances = async (req, res, next) => {
  const id = req.params.id;

  let attendance;

  try {
    attendance = await Attendance.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  if (!attendance) {
    return res.status(404).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ attendance });
};

const searchAttendances = async (req, res, next) => {
  const { q } = req.query;
  try {
    const attendances = await Attendance.find({ employee_ID: q });

    if (!attendances || attendances.length === 0) {
      return res.status(200).json({ message: "No matching records found" });
    }
    return res.status(200).json({ attendances });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllAttendances = getAllAttendances;
exports.addAttendances = addAttendances;
exports.getById = getById;
exports.updateAttendance = updateAttendance;
exports.deleteAttendance = deleteAttedances;
exports.searchAttendances = searchAttendances;
