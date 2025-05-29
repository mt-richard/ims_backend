const {
  sequelize,
  stock_adjustments,
  item_master,
  users,
  locations,
  division_detail,
  adjustment_reasons,
} = require("../models");

// exports.getAllAdjustedRecords = async () => {
//   try {
//     const items = await stock_adjustments.findAll({
//       attributes: ['adjust_id', 'item_id', 'quantity', 'location', 'division', 'employee', 'doc_type', 'qty_balance', 'ref_no', 'adjusted_at', 'reason_id', 'comment', 'status'], // Ensure you select 'adjust_id' explicitly
//       include: [
//         {
//           model: item_master,
//           as: 'itemId',
//           attributes: ['item_name'],
//         },
//         {
//           model: item_master,
//           as: 'itemId',
//           attributes: ['unit'],
//         },
//         {
//           model: users,
//           as: 'adjustedBy',
//           attributes: ['username'],
//         },
//         {
//           model: users,
//           as: 'rejectedBy',
//           attributes: ['username'],
//         },
//         {
//           model: users,
//           as: 'approvedBy',
//           attributes: ['username'],
//         },
//         {
//           model: adjustment_reasons,
//           as: 'reasonId',
//           attributes: ['reason'],
//         },
//         {
//           model: locations,
//           as: 'Location',
//           attributes: ['location_name'],
//         },
//         {
//           model: division_detail,
//           as: 'divisionId',
//           attributes: ['division_name'],
//         },

//       ],
//     });

//     // Transform the items to the desired format
//     return items.map(item => {
//       return {
//         adjust_id: item.adjust_id,
//         ref_no: item.ref_no,
//         item_id: item.item_id,
//         quantity: item.quantity,
//         qty_balance: item.qty_balance,
//         location: item.location,
//         division: item.division,
//         employee: item.employee,
//         doc_type: item.doc_type,
//         reason_id: item.reason_id,
//         adjusted_at: item.adjusted_at,
//         comment: item.comment,
//         status: item.status,
//         itemName: item.itemId ? item.itemId.item_name : null,
//         itemUnit: item.itemId ? item.itemId.unit : null,
//         reasonDet: item.reasonId ? item.reasonId.reason : null,
//         who_adjusted: item.adjustedBy ? item.adjustedBy.username : null,
//         who_rejected: item.rejectedBy ? item.rejectedBy.username : null,
//         who_approved: item.approvedBy ? item.approvedBy.username : null,
//         location_name: item.Location ? item.Location.location_name : null ,
//         division_name: item.divisionId ? item.divisionId.division_name : null ,
//       };
//     });
//   } catch (error) {
//     throw new Error(`Error fetching adjusted items: ${error.message}`);
//   }
// };

exports.getAllAdjustedRecords = async (userId) => {
  try {
    const user = await users.findOne({
      where: { user_id: userId },
    });

    if (!user) throw new Error("User not found");

    const includeOptions = [
      {
        model: item_master,
        as: "itemId",
        attributes: ["item_name", "unit"],
      },
      {
        model: users,
        as: "adjustedBy",
        attributes: ["username"],
      },
      {
        model: users,
        as: "rejectedBy",
        attributes: ["username"],
      },
      {
        model: users,
        as: "approvedBy",
        attributes: ["username"],
      },
      {
        model: adjustment_reasons,
        as: "reasonId",
        attributes: ["reason"],
      },
      {
        model: locations,
        as: "Location",
        attributes: ["location_name"],
      },
      {
        model: division_detail,
        as: "divisionId",
        attributes: ["division_name", "division_id"],
      },
    ];

    // Apply division filter if user is not admin
    if (user.role !== "admin") {
      const divisionInclude = includeOptions.find((i) => i.as === "divisionId");
      divisionInclude.where = { division_id: user.division };
    }

    const items = await stock_adjustments.findAll({
      attributes: [
        "adjust_id",
        "item_id",
        "quantity",
        "location",
        "division",
        "employee",
        "doc_type",
        "qty_balance",
        "ref_no",
        "adjusted_at",
        "reason_id",
        "comment",
        "status",
      ],
      include: includeOptions,
    });

    return items.map((item) => ({
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
      adjusted_at: item.adjusted_at,
      comment: item.comment,
      status: item.status,
      itemName: item.itemId?.item_name || null,
      itemUnit: item.itemId?.unit || null,
      reasonDet: item.reasonId?.reason || null,
      who_adjusted: item.adjustedBy?.username || null,
      who_rejected: item.rejectedBy?.username || null,
      who_approved: item.approvedBy?.username || null,
      location_name: item.Location?.location_name || null,
      division_name: item.divisionId?.division_name || null,
    }));
  } catch (error) {
    throw new Error(`Error fetching adjusted items: ${error.message}`);
  }
};

exports.getAdjustmentById = async (id) => {
  try {
    return await stock_adjustments.findOne({ where: { adjust_id: id } });
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
    // await item_master.update(
    //   { quantity: newQuantity },
    //   { where: { item_id: data.item_id }, transaction }
    // );

    // Save balance after adjustment
    await stock_adjustments.update(
      { qty_balance: newQuantity },
      { where: { adjust_id: stockAdjustment.adjust_id }, transaction }
    );

    await transaction.commit();
    return {
      message: "Stock Adjustment added successfully",
      item: stockAdjustment,
    };
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
    response.status = "inactive";
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
    response.status = "active";
    await response.save();
    return { message: "Adjustment restored successfull", Adjustment: response };
  } catch (error) {
    throw new Error(`Error restoring stock_adjustments: ${error.message}`);
  }
};

exports.editStockAdjustment = async (adjust_id, newData) => {
  const transaction = await sequelize.transaction();

  try {
    // Parse and validate new quantity
    let newQuantity = Math.abs(parseInt(newData.quantity, 10));
    if (isNaN(newQuantity) || newQuantity === 0) {
      throw new Error("Invalid quantity. Must be a non-zero integer.");
    }

    // Apply negative if adjustment is decrease
    if (newData.adjustment_type === "decrease") {
      newQuantity = -newQuantity;
    }

    // Fetch the existing adjustment
    const existingAdjustment = await stock_adjustments.findOne({
      where: { adjust_id },
      transaction,
    });

    if (!existingAdjustment) {
      throw new Error("Adjustment not found");
    }

    const itemId = newData.item_id || existingAdjustment.item_id;

    // Fetch inventory item
    const inventoryItem = await item_master.findOne({
      where: { item_id: itemId },
      transaction,
    });

    if (!inventoryItem) {
      throw new Error("Inventory item not found");
    }

    // Calculate inventory before the old adjustment
    const originalQuantity = parseInt(existingAdjustment.quantity, 10);
    const inventoryBeforeAdjustment = inventoryItem.quantity - originalQuantity;

    // Compute new inventory
    const updatedInventory = inventoryBeforeAdjustment + newQuantity;

    if (updatedInventory < 0) {
      throw new Error("Not enough stock to apply this edit");
    }

    // Update the adjustment
    await stock_adjustments.update(
      {
        ...newData,
        quantity: newQuantity,
        // qty_balance: updatedInventory,
      },
      { where: { adjust_id }, transaction }
    );

    // Update the inventory item
    // await item_master.update(
    //   { quantity: updatedInventory },
    //   { where: { item_id: itemId }, transaction }
    // );

    await transaction.commit();
    return { message: "Stock Adjustment updated successfully" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error updating adjustment: ${error.message}`);
  }
};

exports.approveAdjustment = async (id, userId) => {
  const transaction = await sequelize.transaction();

  try {
    const adjustment = await stock_adjustments.findByPk(id, { transaction });

    if (!adjustment) {
      throw new Error(`Stock Adjustment not found with id: ${id}`);
    }

    if (adjustment.status === "Approved") {
      throw new Error("Adjustment is already approved");
    }

    if (adjustment.status === "Rejected") {
      throw new Error("Rejected adjustments cannot be approved");
    }

    const item = await item_master.findByPk(adjustment.item_id, {
      transaction,
    });

    if (!item) {
      throw new Error("Inventory item not found");
    }

    const adjustmentQty = adjustment.quantity;
    const newQty = item.quantity + adjustmentQty;

    if (newQty < 0) {
      throw new Error("Insufficient total stock to approve this adjustment");
    }

    // 🛠️ Safely parse JSON location field (in case it's stored as a string)
    let locationArray = [];

    if (Array.isArray(item.location)) {
      locationArray = [...item.location];
    } else if (typeof item.location === "string") {
      try {
        locationArray = JSON.parse(item.location);
      } catch (err) {
        throw new Error("Failed to parse item location field");
      }
    }

    const locationId = Number(adjustment.location);
    const locationIndex = locationArray.findIndex(
      (entry) => Number(entry.location_id) === locationId
    );

    if (locationIndex === -1) {
      console.log("Parsed location array:", locationArray);
      throw new Error(`Location ID ${locationId} not found in item location data`);
    }

    const currentQty = parseInt(locationArray[locationIndex].qty || 0, 10);
    const updatedQty = currentQty + adjustmentQty;

    if (updatedQty < 0) {
      throw new Error(`Insufficient stock at location ID ${locationId}`);
    }

    // ✅ Update the matched entry only
    locationArray[locationIndex].qty = updatedQty;

    // ✅ Save updated quantity and location array
    await item_master.update(
      {
        quantity: newQty,
        location: locationArray,
      },
      {
        where: { item_id: item.item_id },
        transaction,
      }
    );

    adjustment.status = "Approved";
    adjustment.qty_balance = newQty;
    adjustment.approved_by = userId;
    adjustment.approved_at = new Date();
    await adjustment.save({ transaction });

    await transaction.commit();
    return { message: "Adjustment approved successfully", adjustment };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error approving adjustment: ${error.message}`);
  }
};


exports.rejectAdjustment = async (id, userId, reason) => {
  try {
    const adjustment = await stock_adjustments.findByPk(id);

    if (!adjustment) {
      throw new Error(`Stock Adjustment not found with id: ${id}`);
    }

    if (adjustment.status === "Approved") {
      throw new Error("Approved adjustments cannot be rejected");
    }

    if (adjustment.status === "Rejected") {
      throw new Error("Adjustment is already rejected");
    }

    adjustment.status = "Rejected";
    adjustment.reject_reason = reason || "No reason provided";
    adjustment.rejected_by = userId;
    adjustment.rejected_at = new Date();

    await adjustment.save();

    return { message: "Adjustment rejected successfully", adjustment };
  } catch (error) {
    throw new Error(`Error rejecting adjustment: ${error.message}`);
  }
};
