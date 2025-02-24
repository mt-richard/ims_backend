const { stock_movements, item_master, locations, users } = require('../models');

exports.getAllItemsMovement = async () => {
  try {
    const items = await stock_movements.findAll({
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
          as: 'assignedUser', 
          attributes: ['username'], 
        },
        {
          model: users,
          as: 'updatedBy', 
          attributes: ['username'], 
        },
        {
          model: locations,
          as: 'destLocation', 
          attributes: ['location_name'], 
        },
        {
          model: locations,
          as: 'sourceLocation', 
          attributes: ['location_name'], 
        },
      ],
    });

    // Transform the items to the desired format
    return items.map(item => {
      return {
        movement_id: item.movement_id,
        item_id: item.item_id,
        quantity: item.quantity,
        movement_type: item.movement_type,
        source_location: item.source_location,
        destination_location: item.destination_location,
        assigned_user: item.assigned_user,
        remark: item.remark,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        item_name: item.itemId ? item.itemId.item_name : null, 
        item_unit: item.itemId ? item.itemId.unit : null, 
        sourceLocation: item.sourceLocation ? item.sourceLocation.location_name : null ,
        destLocation: item.destLocation ? item.destLocation.location_name : null ,
       
      };
    });
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

exports.getItemById = async (id) => {
  try {
    return await stock_movements.findOne({where: {item_id: id }});
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

exports.getByName = async (name) => {
  try {
    return await stock_movements.findOne({ where: { item_name: name } });
  } catch (error) {
    throw new Error(`Error fetching items: ${error.message}`);
  }
};


exports.createItemsMovement = async (data) => {
  try {
    const { item_id, quantity, movement_type, source_location, destination_location } = data;
    const inventoryItem = await item_master.findOne({ where: { item_id } });

    if (!inventoryItem) {
      throw new Error('Item not found in inventory');
    }

    let updatedQuantity = inventoryItem.quantity;

    if (movement_type === 'IN') {
      updatedQuantity += quantity; 
    } else if (movement_type === 'OUT') {
      updatedQuantity -= quantity; 
      if (updatedQuantity < 0) {
        throw new Error('Insufficient inventory to process this movement');
      }
    }

    if (movement_type === 'TRANSFER') {
      if (!destination_location) {
        throw new Error('Destination location must be provided for transfer');
      }

      inventoryItem.location = destination_location;
    } else {
      inventoryItem.quantity = updatedQuantity;
    }

    await inventoryItem.save();

    const response = await stock_movements.create(data);

    return { message: "Item movement successful", item: response };
  } catch (error) {
    throw new Error(`Error creating Item Movement: ${error.message}`);
  }
};



exports.deleteMovement = async (id) => {
  try {
    let response = await stock_movements.findByPk(id);
    if (!response) {
      const error = new Error(` Movement not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'inactive';
    await response.save();
    return { message: "Movement deleted successfull", Movement: response };
  } catch (error) {
    throw new Error(`Error deleting Movement: ${error.message}`);
  }
};

exports.restoreMovement = async (id) => {
  try {
    let response = await stock_movements.findByPk(id);
    if (!response) {
      const error = new Error(` Movement not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'active';
    await response.save();
    return { message: "Movement restored successfull", Movement: response };
  } catch (error) {
    throw new Error(`Error restoring stock_movements: ${error.message}`);
  }
};

exports.editMovement = async (id, name, contact, status) => {
  try {
    let MovementData = await stock_movements.findByPk(id);
    if (!MovementData) {
      const error = new Error(` Movement not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    MovementData.sup_name = name;
    MovementData.contact = contact;
    MovementData.status = status;
    await MovementData.save();
    return { message: "Movement updated successfull", Movement: MovementData };
  } catch (error) {
    throw new Error(`Error restoring User : ${error.message}`);
  }
};