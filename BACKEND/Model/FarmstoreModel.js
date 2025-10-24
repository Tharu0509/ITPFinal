const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  inventoryId:{
    type:String,
    required:true,
  },
  itemName:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true,
  },
  quantity:{
    type:String,
    required:true,
  },
  unitPrice:{
    type:String,
    required:true,
  },
  
   
});

module.exports = mongoose.model(
  "FarmstorekModel",//file name
   storeSchema//function name
  
)