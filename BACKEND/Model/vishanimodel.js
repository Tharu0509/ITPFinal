const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  crop_Type: String,
  crop_Variety: String,
  soilType: String,
  fertilizer: String,
  wateringPerDay: String,
  sunlightHours: String,
  Area_of_Cultivation: String,
  Sowing_Date: String,
  Expected_Harvest_Date: String,
  cropInfoEnglish: String,
  cropInfoSinhala: String,
});

module.exports = mongoose.model("Crop", cropSchema);
