const express = require("express");
const router = express.Router();
const ctrl = require("../Controllers/vishanicontroller");

router.get("/", ctrl.getAllCrops);
router.post("/", ctrl.addCrops);
router.get("/health", ctrl.healthy);
router.get("/:id", ctrl.getById);
router.put("/:id", ctrl.updateCrop);
router.delete("/:id", ctrl.deleteCrop);
router.post("/crop-info", ctrl.cropChatBot);

module.exports = router;
