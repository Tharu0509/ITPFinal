const express = require("express");
const router = express.Router();
const {
  addSale,
  getSalesByMonth,
  updateSale,
  deleteSale,
  searchByName,
  getCropStock,
} = require("../Controllers/salesReportController");

router.post("/", addSale);
router.get("/:cropName/stock", getCropStock);
router.get("/:year/:month", getSalesByMonth);
router.get("/search/by-name", searchByName);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

module.exports = router;
