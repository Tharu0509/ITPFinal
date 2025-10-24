const Fertilizer = require("../Model/fertilizermodel");

const getAllFertilizer = async (req,res,next) => {

    let fertilizer;

    try{
        fertilizer = await Fertilizer.find();
    }catch (err){
        console.log(err);

    }
    //not found
    if(!fertilizer){
        return res.status(404).json({message:"fertilizer not found"});
    }
    //Display all users
    return res.status(200).json({ fertilizers: fertilizer }); // 🔄 plural key



};

//data Insert
const addFertilizer= async (req,res,next) => {
    const{fertilizerType,QuantityRequired,ApplicationDate,Purpose} = req.body;

    let fertilizer;

    try{
        fertilizer = new Fertilizer({fertilizerType,QuantityRequired,ApplicationDate,Purpose});
        await fertilizer.save();
    }catch (err){
        console.log(err);
    }
    //not insert fertilizer
    if (!fertilizer){
        return res.status(404).send({message:"unable to add fertilizer"});
    }
    return res.status(200).json({ fertilizer});

};

//Get by Id
const getById = async (req,res,next) =>{
    const id = req.params.id;

    let fertilizer;

    try{
        fertilizer = await Fertilizer.findById(id);
    }catch (err){
        console.log(err);
    }
    //not available fertilizer
    if (!fertilizer){
        return res.status(404).json({message:"Fertilizer Not Found"});
    }
    return res.status(200).json({ fertilizer});


}
//Update Ferrtilizer Details
const updateFertilizer = async(req,res,next) =>{
    const id = req.params.id;
    const{fertilizerType,QuantityRequired,ApplicationDate,Purpose} =req.body;

    let fertilizer;

    try{
        fertilizer =await Fertilizer.findByIdAndUpdate(id,{fertilizerType: fertilizerType,QuantityRequired: QuantityRequired,ApplicationDate: ApplicationDate,Purpose: Purpose}, { new: true });
        fertilizer = await Fertilizer.save();
    }catch(err){
        console.log(err);
    }
    //not available fertilizer
    if(!fertilizer){
        return res.status(404).json({message:"Unable to update Fertilizer Details"});

    }
    return res.status(200).json({fertilizer});

};
//Delete Fertilizer Details
const deleteFertilizer = async(req,res,next) =>{
    const id = req.params.id;

    let fertilizer;
    try{
        fertilizer = await Fertilizer.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }
    //not available fertilizer
    if(!fertilizer){
        return res.status(404).json({message:"Unable to delete"});
    }
    return res.status(200).json({fertilizer});
}


exports.getAllFertilizer = getAllFertilizer;
exports.addFertilizer = addFertilizer;
exports.getById = getById;
exports.updateFertilizer = updateFertilizer;
exports.deleteFertilizer = deleteFertilizer;