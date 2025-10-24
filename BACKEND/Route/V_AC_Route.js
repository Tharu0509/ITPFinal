const express = require("express");
const router = express.Router();

// Insert task Controller
const V_AC_Controllers = require("../Controllers/V_AC_Controlers");

// ================= Routes =================

// Get all activities
router.get("/", V_AC_Controllers.getAllact);

// Add new activity with image
router.post(
    "/", 
    V_AC_Controllers.upload.single("image"),  // Multer middleware for image upload
    V_AC_Controllers.addact
);

// Get activity by ID
router.get("/:id", V_AC_Controllers.getById);

// Update activity with optional new image
router.put(
    "/:id", 
    V_AC_Controllers.upload.single("image"),  // Multer middleware for image upload
    V_AC_Controllers.updateact
);

// Delete activity
router.delete("/:id", V_AC_Controllers.deleteact);

// export
module.exports = router;
