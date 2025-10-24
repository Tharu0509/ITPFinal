const task = require("../Model/taskModel");

// Get all tasks
const getAlltask = async (req, res, next) => {
  try {
    const Task = await task.find();
    if (!Task || Task.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    return res.status(200).json({ Task });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Add a task
const addtask = async (req, res, next) => {
  const { taskName, dueDate, isCompleted, taskType, expectedCompletionDate } = req.body;
  console.log("Incoming Task Data:", req.body);

  // Input validation
  const errors = [];

  // Validate taskName
  if (!taskName || typeof taskName !== 'string') {
    errors.push("Task name is required and must be a string");
  } else if (taskName.trim().length === 0) {
    errors.push("Task name cannot be empty");
  } else if (taskName.trim().length < 2) {
    errors.push("Task name must be at least 2 characters long");
  } else if (taskName.trim().length > 100) {
    errors.push("Task name cannot exceed 100 characters");
  } else if (!/^[a-zA-Z\s]+$/.test(taskName.trim())) {
    errors.push("Task name is invalid - only letters and spaces are allowed");
  }

  // Validate dueDate
  if (!dueDate) {
    errors.push("Due date is required");
  } else {
    const dueDateObj = new Date(dueDate);
    if (isNaN(dueDateObj.getTime())) {
      errors.push("Invalid due date format");
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDateObj.setHours(0, 0, 0, 0);
      
      if (dueDateObj < today) {
        errors.push("Cannot add tasks for past dates");
      }
      
      // Check if date is not too far in the future (e.g., 2 years)
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);
      if (dueDateObj > maxDate) {
        errors.push("Due date cannot be more than 2 years in the future");
      }
    }
  }

  // Validate taskType
  const validTaskTypes = ["Planting", "Harvesting", "Fertilizing", "Irrigation"];
  if (!taskType) {
    errors.push("Task type is required");
  } else if (!validTaskTypes.includes(taskType)) {
    errors.push(`Task type must be one of: ${validTaskTypes.join(", ")}`);
  }

  // Validate expectedCompletionDate
  if (!expectedCompletionDate) {
    errors.push("Expected completion date is required");
  } else {
    const expectedDateObj = new Date(expectedCompletionDate);
    if (isNaN(expectedDateObj.getTime())) {
      errors.push("Invalid expected completion date format");
    } else {
      const dueDateObj = new Date(dueDate);
      if (expectedDateObj < dueDateObj) {
        errors.push("Expected completion date cannot be before due date");
      }
    }
  }

  // Validate isCompleted
  if (isCompleted !== undefined && typeof isCompleted !== 'boolean') {
    errors.push("Completion status must be a boolean value");
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: errors 
    });
  }

  try {
    const Task = new task({ 
      taskName: taskName.trim(), 
      dueDate, 
      isCompleted: isCompleted || false, 
      taskType, 
      expectedCompletionDate 
    });
    await Task.save();
    return res.status(200).json({ 
      message: "Task added successfully",
      Task 
    });
  } catch (err) {
    console.error("Error while saving task:", err);
    
    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }
    
    return res.status(500).json({ message: "Unable to add task. Please try again." });
  }
};


// Get task by ID
const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const Task = await task.findById(id);
    if (!Task) {
      return res.status(404).send({ message: "Task Not Found" });
    }
    return res.status(200).json({ Task });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update task
const updatetask = async (req, res, next) => {
  const id = req.params.id;
  const { taskName, dueDate, isCompleted, taskType, expectedCompletionDate } = req.body;
  
  // Validate ID format
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid task ID format" });
  }

  // Input validation
  const errors = [];

  // Validate taskName if provided
  if (taskName !== undefined) {
    if (typeof taskName !== 'string') {
      errors.push("Task name must be a string");
    } else if (taskName.trim().length === 0) {
      errors.push("Task name cannot be empty");
    } else if (taskName.trim().length < 2) {
      errors.push("Task name must be at least 2 characters long");
    } else if (taskName.trim().length > 100) {
      errors.push("Task name cannot exceed 100 characters");
    } else if (!/^[a-zA-Z\s]+$/.test(taskName.trim())) {
      errors.push("Task name is invalid - only letters and spaces are allowed");
    }
  }

  // Validate dueDate if provided
  if (dueDate !== undefined) {
    if (!dueDate) {
      errors.push("Due date cannot be empty");
    } else {
      const dueDateObj = new Date(dueDate);
      if (isNaN(dueDateObj.getTime())) {
        errors.push("Invalid due date format");
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dueDateObj.setHours(0, 0, 0, 0);
        
        if (dueDateObj < today) {
          errors.push("Cannot set due date to past dates");
        }
        
        // Check if date is not too far in the future
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);
        if (dueDateObj > maxDate) {
          errors.push("Due date cannot be more than 2 years in the future");
        }
      }
    }
  }

  // Validate taskType if provided
  if (taskType !== undefined) {
    const validTaskTypes = ["Planting", "Harvesting", "Fertilizing", "Irrigation"];
    if (!taskType) {
      errors.push("Task type cannot be empty");
    } else if (!validTaskTypes.includes(taskType)) {
      errors.push(`Task type must be one of: ${validTaskTypes.join(", ")}`);
    }
  }

  // Validate expectedCompletionDate if provided
  if (expectedCompletionDate !== undefined) {
    if (!expectedCompletionDate) {
      errors.push("Expected completion date cannot be empty");
    } else {
      const expectedDateObj = new Date(expectedCompletionDate);
      if (isNaN(expectedDateObj.getTime())) {
        errors.push("Invalid expected completion date format");
      } else {
        const dueDateObj = new Date(dueDate || req.body.dueDate);
        if (expectedDateObj < dueDateObj) {
          errors.push("Expected completion date cannot be before due date");
        }
      }
    }
  }

  // Validate isCompleted if provided
  if (isCompleted !== undefined && typeof isCompleted !== 'boolean') {
    errors.push("Completion status must be a boolean value");
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: errors 
    });
  }

  try {
    // Prepare update object
    const updateData = {};
    if (taskName !== undefined) updateData.taskName = taskName.trim();
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    if (taskType !== undefined) updateData.taskType = taskType;
    if (expectedCompletionDate !== undefined) updateData.expectedCompletionDate = expectedCompletionDate;

    const Task = await task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!Task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    return res.status(200).json({ 
      message: "Task updated successfully",
      Task 
    });
  } catch (err) {
    console.error("Error while updating task:", err);
    
    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid task ID format" });
    }
    
    return res.status(500).json({ message: "Unable to update task. Please try again." });
  }
};

// Delete task
const deletetask = async (req, res, next) => {
  const id = req.params.id;
  try {
    const Task = await task.findByIdAndDelete(id);
    if (!Task) {
      return res.status(404).send({ message: "Unable to delete task" });
    }
    return res.status(200).json({ Task });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get tasks by date
const getTasksByDate = async (req, res, next) => {
  const { date } = req.params;

  try {
    // Create a range for the entire day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const tasks = await task.find({
      dueDate: { $gte: start, $lte: end }
    });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this date" });
    }

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error fetching tasks by date:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Get task statistics and reports
const getTaskStatistics = async (req, res, next) => {
  try {
    const { startDate, endDate, taskType } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      filter.dueDate = { $gte: start, $lte: end };
    }
    
    // Task type filter
    if (taskType) {
      filter.taskType = taskType;
    }
    
    // Get all tasks matching filter
    const tasks = await task.find(filter);
    
    // Calculate statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Task type breakdown
    const taskTypeStats = {};
    tasks.forEach(t => {
      if (!taskTypeStats[t.taskType]) {
        taskTypeStats[t.taskType] = { total: 0, completed: 0 };
      }
      taskTypeStats[t.taskType].total++;
      if (t.isCompleted) {
        taskTypeStats[t.taskType].completed++;
      }
    });
    
    // Monthly completion trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthTasks = await task.find({
        dueDate: { $gte: monthStart, $lte: monthEnd },
        ...(taskType && { taskType })
      });
      
      const monthCompleted = monthTasks.filter(t => t.isCompleted).length;
      const monthTotal = monthTasks.length;
      
      monthlyTrend.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        total: monthTotal,
        completed: monthCompleted,
        completionRate: monthTotal > 0 ? Math.round((monthCompleted / monthTotal) * 100) : 0
      });
    }
    
    // Overdue tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today && !t.isCompleted;
    });
    
    const report = {
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
        overdueTasks: overdueTasks.length
      },
      taskTypeBreakdown: taskTypeStats,
      monthlyTrend,
      overdueTasks: overdueTasks.map(t => ({
        id: t._id,
        taskName: t.taskName,
        taskType: t.taskType,
        dueDate: t.dueDate,
        daysOverdue: Math.floor((today - new Date(t.dueDate)) / (1000 * 60 * 60 * 24))
      })),
      generatedAt: new Date(),
      filter: { startDate, endDate, taskType }
    };
    
    return res.status(200).json({ 
      message: "Task statistics generated successfully",
      report 
    });
  } catch (err) {
    console.error("Error generating task statistics:", err);
    return res.status(500).json({ message: "Server error while generating statistics" });
  }
};

// Get detailed task report
const getDetailedTaskReport = async (req, res, next) => {
  try {
    const { startDate, endDate, taskType, status } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      filter.dueDate = { $gte: start, $lte: end };
    }
    
    // Task type filter
    if (taskType) {
      filter.taskType = taskType;
    }
    
    // Status filter
    if (status === 'completed') {
      filter.isCompleted = true;
    } else if (status === 'pending') {
      filter.isCompleted = false;
    }
    
    // Get tasks with detailed information
    const tasks = await task.find(filter).sort({ dueDate: 1 });
    
    // Format tasks for report
    const formattedTasks = tasks.map(t => ({
      id: t._id,
      taskName: t.taskName,
      taskType: t.taskType,
      dueDate: new Date(t.dueDate).toLocaleDateString(),
      expectedCompletionDate: new Date(t.expectedCompletionDate).toLocaleDateString(),
      status: t.isCompleted ? 'Completed' : 'Pending',
      createdAt: new Date(t.createdAt).toLocaleDateString(),
      daysUntilDue: Math.ceil((new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));
    
    const report = {
      tasks: formattedTasks,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.isCompleted).length,
      pendingTasks: tasks.filter(t => !t.isCompleted).length,
      generatedAt: new Date(),
      filter: { startDate, endDate, taskType, status }
    };
    
    return res.status(200).json({ 
      message: "Detailed task report generated successfully",
      report 
    });
  } catch (err) {
    console.error("Error generating detailed task report:", err);
    return res.status(500).json({ message: "Server error while generating report" });
  }
};

// Get task performance analytics
const getTaskPerformanceAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // Default to last 30 days
    const days = parseInt(period);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get tasks in the period
    const tasks = await task.find({
      dueDate: { $gte: startDate, $lte: endDate }
    });
    
    // Calculate performance metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.isCompleted).length;
    const onTimeCompleted = tasks.filter(t => {
      if (!t.isCompleted) return false;
      const dueDate = new Date(t.dueDate);
      const completedDate = new Date(t.updatedAt || t.createdAt);
      return completedDate <= dueDate;
    }).length;
    
    // Task type performance
    const taskTypePerformance = {};
    const taskTypes = ['Planting', 'Harvesting', 'Fertilizing', 'Irrigation'];
    
    taskTypes.forEach(type => {
      const typeTasks = tasks.filter(t => t.taskType === type);
      const typeCompleted = typeTasks.filter(t => t.isCompleted).length;
      taskTypePerformance[type] = {
        total: typeTasks.length,
        completed: typeCompleted,
        completionRate: typeTasks.length > 0 ? Math.round((typeCompleted / typeTasks.length) * 100) : 0
      };
    });
    
    // Daily completion trend
    const dailyTrend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayTasks = tasks.filter(t => {
        const taskDate = new Date(t.dueDate);
        return taskDate >= dayStart && taskDate <= dayEnd;
      });
      
      const dayCompleted = dayTasks.filter(t => t.isCompleted).length;
      
      dailyTrend.push({
        date: date.toLocaleDateString(),
        total: dayTasks.length,
        completed: dayCompleted,
        completionRate: dayTasks.length > 0 ? Math.round((dayCompleted / dayTasks.length) * 100) : 0
      });
    }
    
    const analytics = {
      period: `${days} days`,
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
        onTimeCompleted,
        overallCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        onTimeCompletionRate: totalTasks > 0 ? Math.round((onTimeCompleted / totalTasks) * 100) : 0
      },
      taskTypePerformance,
      dailyTrend,
      generatedAt: new Date()
    };
    
    return res.status(200).json({ 
      message: "Task performance analytics generated successfully",
      analytics 
    });
  } catch (err) {
    console.error("Error generating task performance analytics:", err);
    return res.status(500).json({ message: "Server error while generating analytics" });
  }
};

exports.getAlltask = getAlltask;
exports.addtask = addtask;
exports.getById = getById;
exports.updatetask = updatetask;
exports.deletetask = deletetask;
exports.getTasksByDate = getTasksByDate;
exports.getTaskStatistics = getTaskStatistics;
exports.getDetailedTaskReport = getDetailedTaskReport;
exports.getTaskPerformanceAnalytics = getTaskPerformanceAnalytics;
