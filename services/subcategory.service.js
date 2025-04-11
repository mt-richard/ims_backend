const { subcategory, divisions } = require('../models');

exports.getSubcategories = async (filters, user) => {
  try {
    const whereClause = {};

    if (user.role !== 'admin') {
      whereClause.division = user.division;
    }

    const subcategories = await subcategory.findAll({
      where: whereClause,
      include: [
        { model: divisions, as: 'divisionId', attributes: ['division_name'] },
      ],
    });

    return subcategories;
  } catch (error) {
    throw new Error(`Error fetching subcategories: ${error.message}`);
  }
};