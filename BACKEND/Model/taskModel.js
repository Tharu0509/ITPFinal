const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  taskType: {
    type: String,
    enum: ["Planting", "Harvesting", "Fertilizing", "Irrigation"], // ✅ Add it here
    required: true
  },
  expectedCompletionDate: { type: Date, required: true }
});

module.exports = mongoose.model("Task", taskSchema);
