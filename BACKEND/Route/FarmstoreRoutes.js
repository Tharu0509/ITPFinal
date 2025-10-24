const express = require("express");
const router = express.Router();

const storeController = require("../Controllers/FarmstoreControllers");

// Get all stores
router.get("/", storeController.getAllStore);

// Add new store
router.post("/", storeController.addStore);

// Get store by ID
router.get("/:id", storeController.getByID);

// Update store
router.put("/:id", storeController.updateStore);

// Delete store
router.delete("/:id", storeController.deleteStore);

module.exports = router;
