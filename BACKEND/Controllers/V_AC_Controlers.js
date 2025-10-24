const act = require("../Model/V_AC_Model");
const multer = require("multer");
const path = require("path");

// ================= Multer Configuration =================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // save images in "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // unique file name
    }
});

// Only allow image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"));
    }
};

const upload = multer({ storage, fileFilter });

// ================== Controller Functions ==================

// Get all activities
const getAllact = async (req, res, next) => {
    let Act;
    try {
        Act = await act.find();
    } catch (err) {
        console.log(err);
    }
    if (!Act || Act.length === 0) {
        return res.status(404).json({ message: "No activities found" });
    }
    return res.status(200).json({ Act });
};

// Add new activity (with image)
const addact = async (req, res, next) => {
    const { title, description, date, time, location, createdAt } = req.body;

    let Act;
    try {
        Act = new act({
            title,
            description,
            date,
            time,
            location,
            createdAt,
            image: req.file ? req.file.filename : null // Save uploaded image filename
        });
        await Act.save();
    } catch (err) {
        console.log(err);
    }

    if (!Act) {
        return res.status(404).send({ message: "Unable to add activity" });
    }
    return res.status(200).json({ Act });
};

// Get activity by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let Act;
    try {
        Act = await act.findById(id);
    } catch (err) {
        console.log(err);
    }
    if (!Act) {
        return res.status(404).send({ message: "Activity Not Found" });
    }
    return res.status(200).json({ Act });
};

// Update activity (with optional image)
const updateact = async (req, res, next) => {
    const id = req.params.id;
    const { title, description, date, time, location, createdAt } = req.body;

    let Act;
    try {
        Act = await act.findByIdAndUpdate(
            id,
            {
                title,
                description,
                date,
                time,
                location,
                createdAt,
                ...(req.file && { image: req.file.filename }) // update image if provided
            },
            { new: true }
        );
    } catch (err) {
        console.log(err);
    }

    if (!Act) {
        return res.status(404).send({ message: "Unable to Update activity details" });
    }
    return res.status(200).json({ Act });
};

// Delete activity
const deleteact = async (req, res, next) => {
    const id = req.params.id;
    let Act;
    try {
        Act = await act.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if (!Act) {
        return res.status(404).send({ message: "Unable to Delete activity details" });
    }
    return res.status(200).json({ Act });
};

// ================== Exports ==================
exports.getAllact = getAllact;
exports.addact = addact;
exports.getById = getById;
exports.updateact = updateact;
exports.deleteact = deleteact;
exports.upload = upload; // export multer for routes

