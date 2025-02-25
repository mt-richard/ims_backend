const { item_transfer, purchase_entry, stock_adjustments, item_master, locations, divisions, users } = require('../models');
const { Op } = require('sequelize');

exports.getStockMovements = async (filters) => {
  try {
    const { startDate, endDate, itemId, locationId, divisionId, docType, status } = filters;

    const whereClause = {};

    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    if (itemId) {
      whereClause.item_id = itemId;
    }

    if (locationId) {
      whereClause.location = locationId;
    }

    if (divisionId) {
      whereClause.division = divisionId;
    }

    if (docType) {
      whereClause.doc_type = docType;
    }

    if (status) {
      whereClause.status = status;
    }

    const itemTransactions = await item_transfer.findAll({
      where: whereClause,
      include: [
        { model: item_master, as: 'itemId', attributes: ['item_name', 'unit'] },
        { model: locations, as: 'Location', attributes: ['location_name'] },
        { model: divisions, as: 'divisionId', attributes: ['division_name'] },
        { model: users, as: 'createdBy', attributes: ['username'] },
        { model: users, as: 'updatedBy', attributes: ['username'] },
      ],
    });

    const purchaseEntries = await purchase_entry.findAll({
      where: whereClause,
      include: [
        { model: item_master, as: 'itemId', attributes: ['item_name', 'unit'] },
        { model: locations, as: 'receivedLocation', attributes: ['location_name'] },
        { model: users, as: 'createdBy', attributes: ['username'] },
      ],
    });

    const stockAdjustments = await stock_adjustments.findAll({
      where: whereClause,
      include: [
        { model: item_master, as: 'itemId', attributes: ['item_name', 'unit'] },
        { model: locations, as: 'Location', attributes: ['location_name'] },
        { model: divisions, as: 'divisionId', attributes: ['division_name'] },
        { model: users, as: 'adjustedBy', attributes: ['username'] },
        { model: users, as: 'approvedBy', attributes: ['username'] },
        { model: users, as: 'rejectedBy', attributes: ['username'] },
      ],
    });

    const combinedResults = [
      ...itemTransactions.map(transaction => ({
        ...transaction.toJSON(),
        type: 'item_transaction',
        item_name: transaction.itemId.item_name,
        unit: transaction.itemId.unit,
        location_name: transaction.Location.location_name,
        division_name: transaction.divisionId.division_name,
        created_by_username: transaction.createdBy ? transaction.createdBy.username : null,
        updated_by_username: transaction.updatedBy ? transaction.updatedBy.username : null,
      })),
      ...purchaseEntries.map(entry => ({
        ...entry.toJSON(),
        type: 'purchase_entry',
        item_name: entry.itemId.item_name,
        unit: entry.itemId.unit,
        location_name: entry.receivedLocation.location_name,
        created_by_username: entry.createdBy ? entry.createdBy.username : null,
      })),
      ...stockAdjustments.map(adjustment => ({
        ...adjustment.toJSON(),
        type: 'stock_adjustment',
        item_name: adjustment.itemId.item_name,
        unit: adjustment.itemId.unit,
        location_name: adjustment.Location.location_name,
        division_name: adjustment.divisionId.division_name,
        adjusted_by_username: adjustment.adjustedBy ? adjustment.adjustedBy.username : null,
        approved_by_username: adjustment.approvedBy ? adjustment.approvedBy.username : null,
        rejected_by_username: adjustment.rejectedBy ? adjustment.rejectedBy.username : null,
      })),
    ];

    return combinedResults;
  } catch (error) {
    throw new Error(`Error fetching stock movements: ${error.message}`);
  }
};