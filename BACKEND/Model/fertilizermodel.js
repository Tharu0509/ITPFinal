const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fertilizerSchema = new mongoose.Schema({
    fertilizerType:{
        type:String,//dataType
        required:true,//variable
    },
    QuantityRequired:{
        type:Number,//dataType
        required:true,//variable
    },
    ApplicationDate:{
        type:Date,//dataType
        required:true,//variable
    },
    Purpose:{
        type:String,//dataType
        required:true,//variable
    },


});

module.exports = mongoose.model("Fertilizer", fertilizerSchema);

