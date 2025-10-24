const express = require("express");
const {
  createVilla,
  getVillas,
  getVillaById,
  updateVilla,
  deleteVilla,
  getVillaImage,
} = require("../Controllers/villaController");
const Villa = require("../Model/Villa");

const multer = require("multer");
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/temp"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CRUD
router.post("/", upload.array("images", 4), createVilla);
router.get("/", getVillas);
router.get("/:id", getVillaById);
router.put("/:id", upload.array("images", 4), updateVilla);
router.delete("/:id", deleteVilla);

// Images
router.get("/:id/image/:index", getVillaImage);
router.get("/:id/image", (req, res, next) => {
  req.params.index = "0";
  next();
}, getVillaImage);

// ✅ Get villa by name
router.get("/by-name/:name", async (req, res) => {
  try {
    const villa = await Villa.findOne({ name: req.params.name });
    if (!villa) return res.status(404).json({ message: "Villa not found" });
    res.json(villa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
