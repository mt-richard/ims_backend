const StockAdjustmentService = require("../services/stock_adjustment.service");

exports.getStockAdjustments = async (req, res) => {
  try {
    const items = await StockAdjustmentService.getAllAdjustedRecords(req.user.id);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStockAdjustment = async (req, res) => { 
  try {
    const { item_id, quantity, adjustment_type, location,division,employee, reason_id, comment, adjusted_at, adjusted_by, status } = req.body;
    const response = await StockAdjustmentService.createStockAdjustment({
      item_id,
      quantity, 
      adjustment_type,
      location,
      division,
      employee,
      reason_id,
      comment,
      adjusted_at,
      adjusted_by,
      status,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.editStockAdjustment = async (req, res) => { 
  try {
    const adjust_id = req.params.id;
    const { item_id, quantity, adjustment_type, location,division,employee, reason_id, comment, adjusted_at, adjusted_by, status } = req.body;
    const response = await StockAdjustmentService.editStockAdjustment(adjust_id,{
      item_id,
      quantity, 
      adjustment_type,
      location,
      division,
      employee,
      reason_id,
      comment,
      adjusted_at,
      adjusted_by,
      status,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 exports.approveAdjustment = async (req, res) => {
    try {
      const id = req.params.id;
      const adjustDta = await StockAdjustmentService.approveAdjustment(id, req.user.id);
      res.status(200).json(adjustDta);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          error: error.message,
          
        });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };

   exports.rejectAdjustment = async (req, res) => {
    try {
      const id = req.params.id;
      const { userId, reason } = req.body;
      const adjustDta = await StockAdjustmentService.rejectAdjustment(id, userId, reason);
      res.status(200).json(adjustDta);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          error: error.message,
          
        });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };