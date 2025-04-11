const { category, divisions } = require('../models');

exports.getCategories = async (filters, user) => {
  try {
    const whereClause = {};

    if (user.role !== 'admin') {
      whereClause.division = user.division;
    }

    const categories = await category.findAll({
      where: whereClause,
      include: [
        { model: divisions, as: 'divisionId', attributes: ['division_name'] },
      ],
    });

    return categories;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};