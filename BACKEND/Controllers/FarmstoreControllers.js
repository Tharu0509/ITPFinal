const Store = require("../Model/FarmstoreModel");

// Get all store items
const getAllStore = async (req, res, next) => {
  let store;
  try {
    store = await Store.find();
  } catch (err) {
    console.log(err);
  }

  if (!store || store.length === 0) {
    return res.status(404).json({ message: "Store not found" });
  }

  return res.status(200).json({ store });
};

// Add store item
const addStore = async (req, res, next) => {
  const { inventoryId, itemName, category, quantity, unitPrice } = req.body;

  let store;
  try {
    store = new Store({ inventoryId, itemName, category, quantity, unitPrice });
    await store.save();
  } catch (err) {
    console.log(err);
  }

  if (!store) {
    return res.status(500).send({ message: "Unable to add store" });
  }
  return res.status(201).json({ store });
};

// Get by ID
const getByID = async (req, res, next) => {
  const id = req.params.id;
  let store;

  try {
    store = await Store.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!store) {
    return res.status(404).send({ message: "Store not found" });
  }
  return res.status(200).json({ store });
};

// Update store details
const updateStore = async (req, res, next) => {
  const id = req.params.id;
  const { inventoryId, itemName, category, quantity, unitPrice } = req.body;

  let store;
  try {
    store = await Store.findByIdAndUpdate(
      id,
      { inventoryId, itemName, category, quantity, unitPrice },
      { new: true } // return updated doc
    );
  } catch (err) {
    console.log(err);
  }

  if (!store) {
    return res.status(404).send({ message: "Unable to update store details" });
  }
  return res.status(200).json({ store });
};

// Delete store details
const deleteStore = async (req, res) => {
  const { id } = req.params;

  try {
    const store = await Store.findByIdAndDelete(id);

    if (!store) {
      return res.status(404).json({ message: "Store not found. Unable to delete." });
    }

    return res.status(200).json({ message: "Store deleted successfully", store });
  } catch (err) {
    console.error("Error deleting store:", err);
    return res.status(500).json({ message: "Server error while deleting store" });
  }
};


exports.getAllStore = getAllStore;
exports.addStore = addStore;
exports.getByID = getByID;
exports.updateStore = updateStore;
exports.deleteStore = deleteStore;
