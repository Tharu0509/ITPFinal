// controllers/cropController.js
const Crop = require("../Model/vishanimodel");
const axios = require("axios");
const translate = require("@vitalets/google-translate-api");
const { getCropInfo } = require("../services/openaiService.js");
require("dotenv").config();

const TREFLE_TOKEN = "EHYqFm_w5vipFo-9UzcrXsdLkO6ISZGoVJKa8DX9vVU"; // Move your token to .env

// Fetch data from Trefle API by crop name
async function fetchTrefleCropData(cropName) {
  try {
    const searchRes = await axios.get(
      `https://trefle.io/api/v1/plants/search?token=${TREFLE_TOKEN}&q=${encodeURIComponent(cropName)}`
    );

    if (searchRes.data.data.length === 0) return null;
    const plantId = searchRes.data.data[0].id;

    const detailRes = await axios.get(
      `https://trefle.io/api/v1/plants/${plantId}?token=${TREFLE_TOKEN}`
    );

    return detailRes.data.data;
  } catch (err) {
    console.error("Trefle API error:", err.message);
    return null;
  }
}

// Add new crop with Trefle + Google Translate integration
const addCrops = async (req, res) => {
  const {
    crop_Type,
    crop_Variety,
    Area_of_Cultivation,
    Sowing_Date,
    Expected_Harvest_Date,
  } = req.body;

  try {
    const data = await fetchTrefleCropData(crop_Type);

    let cropInfoEng = "No detailed info found.";
    let soil = "N/A",
      fertilizer = "N/A",
      watering = "N/A",
      sunlight = "N/A";

    if (data) {
      const g = data.main_species?.growth || {};
      cropInfoEng = `Common: ${data.common_name || "N/A"}
Scientific: ${data.scientific_name || "N/A"}
Family: ${data.family || "N/A"}
Genus: ${data.genus || "N/A"}
Light: ${g.light || "N/A"}
Precipitation: ${g.precipitation_minimum?.cm || "N/A"}–${g.precipitation_maximum?.cm || "N/A"} cm
Soil Texture: ${g.soil_texture || "N/A"}
pH Range: ${g.ph_minimum || "N/A"}–${g.ph_maximum || "N/A"}`;

      soil = g.soil_texture || "N/A";
      watering = `${g.precipitation_minimum?.cm || "N/A"}–${g.precipitation_maximum?.cm || "N/A"} cm`;
      sunlight = g.light || "N/A";
      fertilizer = "Use organic compost."; // Default fallback
    }

    let cropInfoSin = "තොරතුරු නොමැත";
    try {
      const translated = await translate(cropInfoEng, { to: "si" });
      cropInfoSin = translated.text;
    } catch (_) {
      console.warn("Translation failed, using fallback Sinhala text");
    }

    const newCrop = new Crop({
      crop_Type,
      crop_Variety,
      soilType: soil,
      fertilizer,
      wateringPerDay: watering,
      sunlightHours: sunlight,
      Area_of_Cultivation,
      Sowing_Date,
      Expected_Harvest_Date,
      cropInfoEnglish: cropInfoEng,
      cropInfoSinhala: cropInfoSin,
    });

    await newCrop.save();
    res.status(201).json({ message: "Crop added", crop: newCrop });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all crops
const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (err) {
    console.error("Error fetching crops:", err.message);
    res.status(500).json({ error: "Failed to fetch crops" });
  }
};

// Get single crop by ID
const getById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ error: "Crop not found" });
    res.json(crop);
  } catch (err) {
    console.error("Error getting crop:", err.message);
    res.status(500).json({ error: "Failed to fetch crop" });
  }
};

// Update crop by ID
const updateCrop = async (req, res) => {
  try {
    const updated = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Crop not found for update" });
    res.json({ message: "Crop updated", crop: updated });
  } catch (err) {
    console.error("Error updating crop:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
};

// Delete crop by ID
const deleteCrop = async (req, res) => {
  try {
    const deleted = await Crop.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Crop not found for deletion" });
    res.json({ message: "Crop deleted" });
  } catch (err) {
    console.error("Error deleting crop:", err.message);
    res.status(500).json({ error: "Delete failed" });
  }
};

const cropChatBot = async (req, res) => {
  const { cropName } = req.body;

  if (!cropName) {
    return res.status(400).json({ error: "Crop name is required" });
  }

  try {
    const data = await getCropInfo(cropName);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch crop info" });
  }
};

const healthy = async (req, res) => {
  try {
    res.json({ status: "healthy" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch health" });
  }
};


module.exports = {
  addCrops,
  getAllCrops,
  getById,
  updateCrop,
  deleteCrop,
  cropChatBot,
  healthy
};
