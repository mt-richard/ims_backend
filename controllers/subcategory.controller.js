const subcategoryService = require('../services/subcategory.service');

// ...existing code...

exports.getSubcategories = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user; // Assuming user is added to req in authentication middleware
    const results = await subcategoryService.getSubcategories(filters, user);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};