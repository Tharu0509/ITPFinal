const Employee = require("../Model/Employee");
const Attendance = require("../Model/AttendanceModel");
const mongoose = require("mongoose");
const Salary = require("../Model/salarymodel");
const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      phone,
      department,
      role,
      joinedDate,
      salary,
      status,
      address,
      notes,
    } = req.body;

    const exists = await Employee.findOne({ employeeId });
    if (exists) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    const newEmployee = new Employee({
      employeeId,
      name,
      email,
      phone,
      department,
      role,
      joinedDate,
      salary,
      status,
      address,
      notes,
    });

    const saved = await newEmployee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEmployeesWithAttendance = async (req, res) => {
  try {
    const { date } = req.params;
    const { search } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      };
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    const attendances = await Attendance.find({ Date: new Date(date) });

    const merged = employees.map((emp) => {
      const attendance = attendances.find(
        (att) => att.employee_ID === emp.employeeId
      );

      return {
        _id: emp._id,
        employeeId: emp.employeeId,
        name: emp.name,
        department: emp.department,
        role: emp.role,
        status: emp.status,
        attendance: attendance
          ? {
              _id: attendance._id,
              Date: attendance.Date,
              Check_in_Time: attendance.Check_in_Time,
              Check_out_Time: attendance.Check_out_Time,
              Total_hours_Worked: attendance.Total_hours_Worked,
              Shift_Time: attendance.Shift_Time,
              attendance_status: attendance.attendance_status,
            }
          : {
              Date: date,
              Check_in_Time: "",
              Check_out_Time: "",
              Total_hours_Worked: "",
              Shift_Time: "",
              attendance_status: "Pending", // default
            },
      };
    });

    res.json(merged);
  } catch (err) {
    console.error("Error fetching employees with attendance:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch employees with attendance" });
  }
};

const getEmployeesWithAttendanceByMonth = async (req, res) => {
  try {
    const { year, month } = req.params; 
    const { search } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required" });
    }

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      };
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });

    const attendances = await Attendance.find({
      Date: { $gte: startDate, $lt: endDate },
    });

    const ymKey = parseInt(`${year}${month}`);
    const salaries = await Salary.find({ Attendance: ymKey });

    const merged = employees.map((emp) => {
      const empAttendances = attendances.filter(
        (att) => att.employee_ID === emp.employeeId
      );

      const totalNormalHours = empAttendances.reduce(
        (sum, att) => sum + (parseFloat(att.Total_hours_Worked) || 0),
        0
      );
      const totalOtHours = empAttendances.reduce(
        (sum, att) => sum + (parseFloat(att.Shift_Time) || 0),
        0
      );

      const empSalary = salaries.find(
        (sal) => sal.EmployeeID === emp.employeeId
      );

      return {
        _id: emp._id,
        employeeId: emp.employeeId,
        name: emp.name,
        department: emp.department,
        role: emp.role,
        status: emp.status,

        attendances: empAttendances,

        summary: {
          normalHours: totalNormalHours,
          otHours: totalOtHours,
        },

        salary: empSalary
          ? {
              _id: empSalary._id,
              Netsalary: empSalary.Netsalary,
              otRate: empSalary.otRate || 0,
              normalRate: empSalary.normalRate || 0,
              paymentstatus: empSalary.paymentstatus,
            }
          : null,
      };
    });

    res.json(merged);
  } catch (err) {
    console.error("Error fetching employees with monthly attendance:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch employees with attendance" });
  }
};


const getEmployees = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
        ],
      };
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// ✅ Get employee by MongoDB _id
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
};

// ✅ Get employee by employeeId (custom ID)
const getEmployeeByEmployeeId = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      employeeId: req.params.employeeId,
    });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
};

// ✅ Update employee by _id
const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update employee" });
  }
};

// ✅ Delete employee by _id
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    return res.status(500).json({ error: "Failed to delete employee" });
  }
};

// 👉 Export all functions
module.exports = {
  createEmployee,
  getEmployeesWithAttendance,
  getEmployeesWithAttendanceByMonth,
  getEmployees,
  getEmployeeById,
  getEmployeeByEmployeeId,
  updateEmployee,
  deleteEmployee,
};
