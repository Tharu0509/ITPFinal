const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    // Admin-assigned unique ID (not auto)
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true, // allows null emails while keeping unique when set
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    joinedDate: {
      type: Date,
    },
    salary: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    address: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

// Add a text index for searching by name or employeeId
employeeSchema.index({ name: "text", employeeId: "text" });

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
