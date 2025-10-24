const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
    EmployeeID: {
        type: String,   // String is valid
        required: true,
    },
    Attendance: {
        type: Number,   // Use Number for int
        required: true,
    },
    BasicSalary: {
        type: Number,   // Use Number for double/float
        required: true,
    },
    Hours: {
        type: Number,   // Use Number
        required: true,
    },
    Netsalary: {
        type: Number,   // Use Number
        required: true,
    },
    paymentstatus: {
        type: String,  // Use Boolean (capital B)
        required: true,
    },
});

module.exports = mongoose.model("Salary", salarySchema);
