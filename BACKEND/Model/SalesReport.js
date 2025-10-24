const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesSchema = new Schema({
  cropName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  income: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SalesModel", salesSchema);
