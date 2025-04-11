const itemTransferService = require('../services/item_transfer.service');

// ...existing code...

exports.getItemTransfers = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user; // Assuming user is added to req in authentication middleware
    const results = await itemTransferService.getItemTransfers(filters, user);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};