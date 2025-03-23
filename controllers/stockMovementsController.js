const stock_movements = require('../services/stock_movements.service');

exports.getStockMovements = async (req, res) => {
  try {
    const filters = req.query;
    const data = await stock_movements.getStockMovements(filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStockMovementsByItem = async (req, res) => {
  try {
    const filters = req.query;
    const data = await stock_movements.getStockMovementByItem(filters);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};