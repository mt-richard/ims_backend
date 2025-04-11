const purchaseEntryService = require('../services/purchase_entry.service');

// ...existing code...

exports.getPurchaseEntries = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user; // Assuming user is added to req in authentication middleware
    const results = await purchaseEntryService.getPurchaseEntries(filters, user);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};