const categoryService = require('../services/category.service');

// ...existing code...

exports.getCategories = async (req, res) => {
  try {
    const filters = req.query;
    const user = req.user; // Assuming user is added to req in authentication middleware
    const results = await categoryService.getCategories(filters, user);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};