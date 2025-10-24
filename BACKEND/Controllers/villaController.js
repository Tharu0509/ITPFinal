const fs = require("fs");
const Villa = require("../Model/Villa");

// ➕ Create Villa with up to 4 images
const createVilla = async (req, res) => {
  try {
    const { name, location, price, description, amenities } = req.body;

    const images = (req.files || []).map((file) => ({
      data: fs.readFileSync(file.path),
      contentType: file.mimetype,
    }));

    const villa = new Villa({
      name,
      location,
      price,
      description,
      amenities: amenities ? amenities.split(",") : [],
      images,
    });

    const savedVilla = await villa.save();
    res.status(201).json(savedVilla);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get All Villas
const getVillas = async (req, res) => {
  try {
    const villas = await Villa.find().select("-images.data"); // ❌ buffers skip කරන්න
    res.json(villas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📄 Get Villa by ID
const getVillaById = async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) return res.status(404).json({ message: "Villa not found" });
    res.json(villa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📝 Update Villa
const updateVilla = async (req, res) => {
  try {
    const { name, location, price, description, amenities } = req.body;

    const updateData = {
      name,
      location,
      price,
      description,
      amenities: amenities ? amenities.split(",") : [],
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => ({
        data: fs.readFileSync(file.path),
        contentType: file.mimetype,
      }));
    }

    const updatedVilla = await Villa.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedVilla)
      return res.status(404).json({ message: "Villa not found" });

    res.json(updatedVilla);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Villa
const deleteVilla = async (req, res) => {
  try {
    const deletedVilla = await Villa.findByIdAndDelete(req.params.id);
    if (!deletedVilla)
      return res.status(404).json({ message: "Villa not found" });
    res.json({ message: "Villa deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🖼 Serve Image by index (0–3)
const getVillaImage = async (req, res) => {
  try {
    const villa = await Villa.findById(req.params.id);
    const index = parseInt(req.params.index) || 0;

    if (!villa || !villa.images || !villa.images[index]) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.set("Content-Type", villa.images[index].contentType);
    res.send(villa.images[index].data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVilla,
  getVillas,
  getVillaById,
  updateVilla,
  deleteVilla,
  getVillaImage,
};

