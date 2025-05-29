const { stock_adjustments, division_detail } = require('../models');

exports.getStockAdjustments = async (filters, user) => {
  try {
    const whereClause = {};

    if (user.role !== 'admin') {
      whereClause.division = user.division;
    }

    const adjustments = await stock_adjustments.findAll({
      where: whereClause,
      include: [
        { model: division_detail, as: 'divisionId', attributes: ['division_name'] },
      ],
    });

    return adjustments;
  } catch (error) {
    throw new Error(`Error fetching stock adjustments: ${error.message}`);
  }
};