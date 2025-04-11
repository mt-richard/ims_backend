const stockMovementsService = require('../services/stock_movements.service');


exports.getStockMovements = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user; // Assuming user is added to req in authentication middleware
    const results = await stockMovementsService.getStockMovements(filters, user);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStockMovementByItem = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user; // Assuming user is added to req in authentication middleware
    const results = await stockMovementsService.getStockMovementByItem(filters, user);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};