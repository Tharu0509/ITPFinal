const Sales = require("../Model/SalesReport");
const Store = require("../Model/FarmstoreModel");

const addSale = async (req, res) => {
  try {
    const { cropName, quantity, unitPrice } = req.body;

    const stock = await Store.findOne({ itemName: cropName });
    if (!stock)
      return res.status(404).json({ error: "Crop not found in stock" });

    if (Number(quantity) > Number(stock.quantity)) {
      return res
        .status(400)
        .json({ error: `Not enough stock. Available: ${stock.quantity}` });
    }

    const income = quantity * unitPrice;

    const sale = new Sales({ cropName, quantity, unitPrice, income });
    await sale.save();

    stock.quantity = Number(stock.quantity) - Number(quantity);
    await stock.save();

    res.status(201).json({ sale });
  } catch (err) {
    console.error("Error adding sale:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getCropStock = async (req, res) => {
  try {
    const { cropName } = req.params;

    const crop = await Store.findOne({ itemName: cropName });

    if (!crop) {
      return res.status(404).json({ error: "Crop not found in store" });
    }

    res.json({
      itemName: crop.itemName,
      category: crop.category,
      stock: Number(crop.quantity),
      unitPrice: Number(crop.unitPrice),
    });
  } catch (err) {
    console.error("Error fetching crop stock:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const searchByName = async (req, res) => {
  const { name } = req.query;
  let stores;

  try {
    if (!name) {
      return res.status(400).json({ message: "Name query is required" });
    }

    stores = await Store.find({
      itemName: { $regex: name, $options: "i" },
    });
  } catch (err) {
    console.error("Error searching store:", err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!stores || stores.length === 0) {
    return res.status(404).json({ message: "No items found" });
  }

  return res.status(200).json(stores);
};

const getSalesByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const sales = await Sales.find({
      date: { $gte: startDate, $lt: endDate },
    });

    res.json(sales);
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { cropName, quantity, unitPrice } = req.body;

    const qty = Number(quantity);
    const price = Number(unitPrice);

    if (isNaN(qty) || isNaN(price) || qty <= 0 || price <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity and price must be valid numbers" });
    }

    const sale = await Sales.findById(id);
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const stock = await Store.findOne({ itemName: cropName });
    if (!stock)
      return res.status(404).json({ error: "Crop not found in stock" });

    const currentStock = Number(stock.quantity);
    const oldQuantity = Number(sale.quantity);

    if (qty > oldQuantity) {
      const diff = qty - oldQuantity;
      if (diff > currentStock) {
        return res
          .status(400)
          .json({ error: `Not enough stock. Available: ${currentStock}` });
      }
      stock.quantity = currentStock - diff;
    } else if (qty < oldQuantity) {
      const diff = oldQuantity - qty;
      stock.quantity = currentStock + diff;
    }

    sale.cropName = cropName;
    sale.quantity = qty;
    sale.unitPrice = price;
    sale.income = qty * price;

    await sale.save();
    await stock.save();

    res.json({ sale });
  } catch (err) {
    console.error("Error updating sale:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await Sales.findById(id);
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const stock = await Store.findOne({ itemName: sale.cropName });
    if (stock) {
      stock.quantity = Number(stock.quantity) + Number(sale.quantity);
      await stock.save();
    }

    await sale.deleteOne();

    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    console.error("Error deleting sale:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addSale,
  getSalesByMonth,
  updateSale,
  deleteSale,
  searchByName,
  getCropStock,
};
