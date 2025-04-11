const stockAdjustmentsService = require('../services/stock_adjustments.service');

// ...existing code...

exports.getStockAdjustments = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user; // Assuming user is added to req in authentication middleware
    const results = await stockAdjustmentsService.getStockAdjustments(filters, user);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};