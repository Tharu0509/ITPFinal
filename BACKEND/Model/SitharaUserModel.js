// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   name:{
//     type:String,
//     required:true,
//   },
//   email:{
//     type:String,
//     required:true,
//   },
//   phoneNumber:{
//     type:String,
//     required:true,
//   },
//   village:{
//     type:String,
//     required:true,
//   },
//   district:{
//     type:String,
//     required:true,
//   },
//   province:{
//     type:String,
//     required:true,
//   },
//   farmSize:{
//     type:String,
//     required:true,
//   },
//   primaryCrop:{
//     type:String,
//     required:true,
//   },
//   secondaryCrops:{
//     type:String,
//     required:true,
//   },
//   yearsOfExperience:{
//     type:String,
//     required:true,
//   },

//   lastWeatherFetched: Date,
//   lastWeatherData: {
//     temperature: String,
//     condition: String,
//     icon: String,
//     windSpeed: String,
//   }
// });

// module.exports = mongoose.model(
//   "userModel",//file name
//   userSchema //function name
// )