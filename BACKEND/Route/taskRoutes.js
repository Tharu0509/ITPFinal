const express = require("express");
const router = express.Router();
//Insert Model
const task = require("../Model/taskModel")
//Insert task Controller
const taskController = require("../Controllers/taskController");

router.get("/",taskController.getAlltask);
router.post("/",taskController.addtask);
router.get("/:id",taskController.getById);
router.put("/:id",taskController.updatetask);
router.delete("/:id",taskController.deletetask);
router.get("/date/:date", taskController.getTasksByDate);

// Report routes
router.get("/reports/statistics", taskController.getTaskStatistics);
router.get("/reports/detailed", taskController.getDetailedTaskReport);
router.get("/reports/analytics", taskController.getTaskPerformanceAnalytics);


//export
module.exports = router;
