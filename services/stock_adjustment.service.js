const { sequelize, stock_adjustments, item_master, users,locations,divisions, adjustment_reasons } = require('../models');


exports.getAllAdjustedRecords = async () => {
  try {
    const items = await stock_adjustments.findAll({
      attributes: ['adjust_id', 'item_id', 'quantity', 'location', 'division', 'employee', 'doc_type', 'qty_balance', 'ref_no', 'reason_id', 'comment', 'status'], // Ensure you select 'adjust_id' explicitly
      include: [
        {
          model: item_master,
          as: 'itemId', 
          attributes: ['item_name'], 
        },
        {
          model: item_master,
          as: 'itemId', 
          attributes: ['unit'], 
        },
        {
          model: users,
          as: 'adjustedBy', 
          attributes: ['username'], 
        },
        {
          model: users,
          as: 'rejectedBy',  
          attributes: ['username'], 
        },
        {
          model: users,
          as: 'approvedBy',  
          attributes: ['username'], 
        },
        {
          model: adjustment_reasons,
          as: 'reasonId',  
          attributes: ['reason'], 
        },  
        {
          model: locations,
          as: 'Location', 
          attributes: ['location_name'], 
        },
        {
          model: divisions,
          as: 'divisionId', 
          attributes: ['division_name'], 
        },  
        
      ],
    });

    // Transform the items to the desired format
    return items.map(item => {
      return {
        adjust_id: item.adjust_id,
        ref_no: item.ref_no,
        item_id: item.item_id,
        quantity: item.quantity,
        qty_balance: item.qty_balance,
        location: item.location,
        division: item.division,
        employee: item.employee,
        doc_type: item.doc_type,
        reason_id: item.reason_id,
        comment: item.comment,
        status: item.status,
        itemName: item.itemId ? item.itemId.item_name : null, 
        itemUnit: item.itemId ? item.itemId.unit : null, 
        reasonDet: item.reasonId ? item.reasonId.reason : null, 
        who_adjusted: item.adjustedBy ? item.adjustedBy.username : null, 
        who_rejected: item.rejectedBy ? item.rejectedBy.username : null, 
        who_approved: item.approvedBy ? item.approvedBy.username : null, 
        location_name: item.Location ? item.Location.location_name : null ,
        division_name: item.divisionId ? item.divisionId.division_name : null ,
      };
    });
  } catch (error) {
    throw new Error(`Error fetching adjusted items: ${error.message}`);
  }
};

exports.getAdjustmentById = async (id) => {
  try {
    return await stock_adjustments.findOne({where: {adjust_id: id }});
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};


exports.createStockAdjustment = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    // Parse and validate quantity (ensure it's positive)
    let quantity = Math.abs(parseInt(data.quantity, 10)); // Convert to absolute value
    if (isNaN(quantity) || quantity === 0) {
      throw new Error("Invalid quantity. Must be a non-zero integer.");
    }

    // If reducing stock, convert quantity to negative
    if (data.adjustment_type === "decrease") {
      quantity = -quantity;
    }

    const currentDate = new Date();
    const yearShort = String(currentDate.getFullYear()).slice(-2);

    const lastEntry = await stock_adjustments.findOne({
      order: [["adjust_id", "DESC"]],
      attributes: ["ref_no"],
      transaction,
    });

    let lastNumber = 1;
    if (lastEntry && lastEntry.ref_no) {
      const match = lastEntry.ref_no.match(/ADJ(\d+)-(\d{2})/);
      if (match) {
        lastNumber = parseInt(match[1], 10) + 1;
      }
    }

    const refNo = `ADJ${String(lastNumber).padStart(3, "0")}-${yearShort}`;

    // Find the inventory item
    const inventoryItem = await item_master.findOne({
      where: { item_id: data.item_id },
      transaction,
    });

    if (!inventoryItem) {
      throw new Error("Inventory item not found");
    }

    // Calculate new stock quantity
    const newQuantity = inventoryItem.quantity + quantity;

    if (newQuantity < 0) {
      throw new Error("Not enough stock to reduce");
    }
    // Save stock adjustment with correct quantity
    const stockAdjustment = await stock_adjustments.create(
      {
        ...data,
        ref_no: refNo,
        quantity, 
      },
      { transaction }
    );

    // Update inventory quantity
    await item_master.update(
      { quantity: newQuantity },
      { where: { item_id: data.item_id }, transaction }
    );

    // Save balance after adjustment
    await stock_adjustments.update(
      { qty_balance: newQuantity },
      { where: { adjust_id: stockAdjustment.adjust_id }, transaction }
    );

    await transaction.commit();
    return { message: "Stock Adjustment added successfully", item: stockAdjustment };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error creating adjustment: ${error.message}`);
  }
};


exports.deleteAdjustment = async (id) => {
  try {
    let response = await stock_adjustments.findByPk(id);
    if (!response) {
      const error = new Error(` Stock Adjustment not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'inactive';
    await response.save();
    return { message: "Adjustment deleted successfull", Adjustment: response };
  } catch (error) {
    throw new Error(`Error deleting Adjustment: ${error.message}`);
  }
};

exports.restoreAdjustment = async (id) => {
  try {
    let response = await stock_adjustments.findByPk(id);
    if (!response) {
      const error = new Error(` Adjustment not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'active';
    await response.save();
    return { message: "Adjustment restored successfull", Adjustment: response };
  } catch (error) {
    throw new Error(`Error restoring stock_adjustments: ${error.message}`);
  }
};

exports.editAdjustment = async (id, item_id, quantity, adjust_type, reason, status) => {
  try {
    let AdjustmentData = await stock_adjustments.findByPk(id);
    if (!AdjustmentData) {
      const error = new Error(` Adjustment not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    AdjustmentData.item_id = item_id;
    AdjustmentData.quantity = quantity;
    AdjustmentData.adjust_type = adjust_type;
    AdjustmentData.reason = reason;
    AdjustmentData.status = status;
    await AdjustmentData.save();
    return { message: "Adjustment updated successfull", Adjustment: AdjustmentData };
  } catch (error) {
    throw new Error(`Error restoring User : ${error.message}`);
  }
};