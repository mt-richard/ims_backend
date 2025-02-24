const { item_assign, item_master, locations, divisions, users, sequelize } = require('../models');

exports.getAllAssignments = async () => {
  try {
    const items = await item_assign.findAll({
      include: [
        {
          model: item_master,
          as: 'itemId', 
          attributes: ['item_name', 'unit', 'quantity', 'status'], 
        },
        {
          model: users,
          as: 'createdBy', 
          attributes: ['username'], 
        },
        {
          model: users,
          as: 'updatedBy', 
          attributes: ['username'], 
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
        assign_id: item.assign_id,
        item_id: item.item_id,
        tag_id: item.tag_id,
        serial_number: item.serial_number,
        location: item.location,
        division: item.division,
        employee: item.employee,
        remark: item.remark,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        item_name: item.itemId ? item.itemId.item_name : null, 
        item_unit: item.itemId ? item.itemId.unit : null, 
        item_quantity: item.itemId ? item.itemId.quantity : null,
        item_status: item.itemId ? item.itemId.status : null,
        location_name: item.Location ? item.Location.location_name : null,
        division_name: item.divisionId ? item.divisionId.division_name : null,
        created_by_username: item.createdBy ? item.createdBy.username : null,
        updated_by_username: item.updatedBy ? item.updatedBy.username : null,
      };
    });
  } catch (error) {
    throw new Error(`Error fetching item assignments: ${error.message}`);
  }
};

exports.getAssignmentById = async (id) => {
  try {
    return await item_assign.findOne({
      where: { assign_id: id },
      include: [
        {
          model: item_master,
          as: 'itemId', 
          attributes: ['item_name', 'unit', 'quantity', 'status'], 
        },
        {
          model: users,
          as: 'createdBy', 
          attributes: ['username'], 
        },
        {
          model: users,
          as: 'updatedBy', 
          attributes: ['username'], 
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
  } catch (error) {
    throw new Error(`Error fetching item assignment: ${error.message}`);
  }
};

exports.getAssignmentsByItemId = async (itemId) => {
  try {
    const items = await item_assign.findAll({
      where: { item_id: itemId },
      include: [
        {
          model: item_master,
          as: 'itemId', 
          attributes: ['item_name', 'unit', 'quantity', 'status'], 
        },
        {
          model: users,
          as: 'createdBy', 
          attributes: ['username'], 
        },
        {
          model: users,
          as: 'updatedBy', 
          attributes: ['username'], 
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
        assign_id: item.assign_id,
        item_id: item.item_id,
        tag_id: item.tag_id,
        serial_number: item.serial_number,
        location: item.location,
        division: item.division,
        employee: item.employee,
        remark: item.remark,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        item_name: item.itemId ? item.itemId.item_name : null, 
        item_unit: item.itemId ? item.itemId.unit : null, 
        item_quantity: item.itemId ? item.itemId.quantity : null,
        item_status: item.itemId ? item.itemId.status : null,
        location_name: item.Location ? item.Location.location_name : null,
        division_name: item.divisionId ? item.divisionId.division_name : null,
        created_by_username: item.createdBy ? item.createdBy.username : null,
        updated_by_username: item.updatedBy ? item.updatedBy.username : null,
      };
    });
  } catch (error) {
    throw new Error(`Error fetching item assignments: ${error.message}`);
  }
};

exports.createItemAssign = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate item quantity and status
    const inventoryItem = await item_master.findOne({
      where: { item_id: data.item_id },
      transaction,
    });

    if (!inventoryItem) {
      throw new Error("Inventory item not found.");
    }

    if (inventoryItem.quantity <= 0) {
      throw new Error("Insufficient quantity in stock.");
    }

    if (inventoryItem.status !== 'active') {
      throw new Error("Inventory item is not active.");
    }

    // Generate tag_id based on category
    const categoryPrefix = inventoryItem.category.slice(0, 3).toUpperCase();
    const prefix = `ABG${categoryPrefix}`;

    const lastEntry = await item_assign.findOne({
      where: {
        tag_id: {
          [sequelize.Op.like]: `${prefix}%`
        }
      },
      order: [['assign_id', 'DESC']],
      transaction,
    });

    let lastNumber = 1;
    if (lastEntry && lastEntry.tag_id) {
      const match = lastEntry.tag_id.match(new RegExp(`${prefix}(\\d{3})`));
      if (match) {
        lastNumber = parseInt(match[1], 10) + 1;
      }
    }

    const tag_id = `${prefix}${String(lastNumber).padStart(3, '0')}`;

    const itemAssign = await item_assign.create(
      {
        ...data,
        tag_id,
      },
      { transaction }
    );

    await transaction.commit();
    return { message: "Item assigned successfully", item: itemAssign };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error creating item assignment: ${error.message}`);
  }
};