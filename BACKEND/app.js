require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");


// Routers
const cropRouter = require("./Route/vishaniroute");
const taskRouter = require("./Route/taskRoutes");
const fertilizerRouter = require("./Route/fertilizerroute");
//const userRouter = require("./Route/SitharaUserReg");
const weatherRoute = require("./Route/TharuWeather");
const salesReportRoutes = require("./Route/salesReportRoutes");
const villaRoutes = require("./Route/villaRoutes"); 
const adminRoutes = require("./Route/adminRoutes");
const authRoutes = require("./Route/authRoutes");
const bookingRoutes = require("./Route/bookingRoutes");
const VArouter = require("./Route/V_AC_Route");
const FeedbackRoutes = require("./Route/FeedbackRoutes");
const FarmstoreRoutes = require("./Route/FarmstoreRoutes");
const router = require("./Route/salaryroute");
const AttendanceRoutes = require("./Route/AttendanceRoutes");
const employeeRoutes = require("./Route/employeeRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/weather", weatherRoute);
app.use("/crops", cropRouter);
app.use("/tasks", taskRouter);
app.use("/fertilizers", fertilizerRouter);
//app.use("/api/users", userRouter);
app.use("/sales", salesReportRoutes);
app.use("/api/villas", villaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/activities", VArouter);
app.use("/feedback", FeedbackRoutes);
app.use("/farmstore", FarmstoreRoutes);
app.use("/salary",router);
app.use("/attendances",AttendanceRoutes);
app.use("/employees",employeeRoutes);

// MongoDB + Start server
mongoose
  .connect("mongodb+srv://admin0:4IZmuKebIEndrhn0@cluster0.vcfng4n.mongodb.net/farm&villadb?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000");
    });
  })
  .catch((err) => console.error("MongoDB Error:", err));

