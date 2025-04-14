const { item_transfer, item_master, locations, divisions, users, sequelize } = require('../models');

exports.getAllTransactions = async () => {
  try {
    const items = await item_transfer.findAll({
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
        // {
        //   model: users,
        //   as: 'assignedUser', 
        //   attributes: ['username'], 
        // },
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
        transfer_id: item.transfer_id,
        item_id: item.item_id,
        ref_no: item.ref_no,
        quantity: item.quantity,
        qty_balance: item.qty_balance,
        location: item.location,
        division: item.division,
        employee: item.employee,
        remark: item.remark,
        doc_type: item.doc_type,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        item_name: item.itemId ? item.itemId.item_name : null, 
        item_unit: item.itemId ? item.itemId.unit : null, 
        location_name: item.Location ? item.Location.location_name : null ,
        division_name: item.divisionId ? item.divisionId.division_name : null ,
       
      };
    });
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

exports.getAllTransactionsByDiv = async (userId) => {
  try {
    const user = await users.findOne({
      where: { user_id: userId },
    });

    if (!user) throw new Error('User not found');

    let refNosToInclude = [];

    if (user.role !== 'admin') {
      // Step 1: Get ref_no values for the user's division
      const divisionTransfers = await item_transfer.findAll({
        where: { division: user.division },
        attributes: ['ref_no'],
        raw: true,
      });

      refNosToInclude = divisionTransfers.map(t => t.ref_no);
    }

    const queryOptions = {
      where: {},
      include: [
        {
          model: users,
          as: 'updatedBy',
          attributes: ['username'],
        },
        {
          model: item_master,
          as: 'itemId',
          attributes: ['item_name', 'unit'],
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
    };

    if (user.role !== 'admin' && refNosToInclude.length > 0) {
      // Step 2: Add WHERE clause for all matching ref_no values
      queryOptions.where = {
        ref_no: refNosToInclude,
      };
    }

    const items = await item_transfer.findAll(queryOptions);

    // Step 3: Format the result
    return items.map(item => ({
      transfer_id: item.transfer_id,
      item_id: item.item_id,
      ref_no: item.ref_no,
      quantity: item.quantity,
      qty_balance: item.qty_balance,
      location: item.location,
      division: item.division,
      employee: item.employee,
      remark: item.remark,
      doc_type: item.doc_type,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at,
      created_by: item.created_by,
      updated_by: item.updated_by,
      item_name: item.itemId ? item.itemId.item_name : null,
      item_unit: item.itemId ? item.itemId.unit : null,
      location_name: item.Location ? item.Location.location_name : null,
      division_name: item.divisionId ? item.divisionId.division_name : null,
    }));
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

exports.getTransactionByRef = async (ref) => {
  try {
    return await item_transfer.findOne({where: {ref_no: ref }});
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

exports.getTransactionById = async (id) => {
  try {
    return await item_transfer.findOne({where: {transfer_id: id }});
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

exports.createTransaction = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const quantity = parseInt(data.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error("Invalid quantity. Must be a positive integer.");
    }

    // Check if the provided division values exist
    const fromDivision = await divisions.findOne({
      where: { division_id: data.from_division },
    });
    const toDivision = await divisions.findOne({
      where: { division_id: data.to_division },
    });

    if (!fromDivision || !toDivision) {
      throw new Error("One or more provided divisions do not exist.");
    }

    const currentDate = new Date();
    const yearShort = String(currentDate.getFullYear()).slice(-2);

    const lastEntry = await item_transfer.findOne({
      order: [["transfer_id", "DESC"]],
      attributes: ["ref_no"],
      transaction,
    });

    let lastNumber = 1;
    if (lastEntry && lastEntry.ref_no) {
      const match = lastEntry.ref_no.match(/TR(\d+)-(\d{2})/);
      if (match) {
        lastNumber = parseInt(match[1], 10) + 1;
      }
    }

    const refNo = `TR${String(lastNumber).padStart(3, "0")}-${yearShort}`;

    const createEntry = async (item, transactionType, location, division, employee, docType) => {
      await item_transfer.create(
        {
          item_id: item.item_id,
          location: location,
          division: division,
          employee: employee || '',
          quantity: transactionType === "remove" ? -quantity : quantity,
          remark: item.remark,
          ref_no: refNo,
          created_by: item.created_by,
          qty_balance: inventoryItem.quantity,
          doc_type: docType,
        },
        { transaction }
      );
    };

    // Retrieve inventory item to update quantity
    const inventoryItem = await item_master.findOne({
      where: { item_id: data.item_id },
      transaction,
    });

    if (!inventoryItem) {
      throw new Error("Inventory item not found.");
    }

    // Update the location JSON field for from_location
    let locationData;
    try {
      locationData = JSON.parse(inventoryItem.location);
      if (!Array.isArray(locationData)) {
        throw new Error("Invalid location data format");
      }
    } catch (error) {
      console.error("Error parsing location data:", error.message);
      throw new Error("Invalid location data format");
    }

    const fromLocationIndex = locationData.findIndex(loc => loc.location_id === parseInt(data.from_location, 10));
    if (fromLocationIndex !== -1) {
      if (locationData[fromLocationIndex].qty < quantity) {
        throw new Error("Insufficient quantity in the from_location.");
      }
      locationData[fromLocationIndex].qty -= quantity;
    } else {
      throw new Error("from_location not found in the location data.");
    }

    // Update the location JSON field for to_location
    const toLocationIndex = locationData.findIndex(loc => loc.location_id === parseInt(data.to_location, 10));
    if (toLocationIndex !== -1) {
      locationData[toLocationIndex].qty += quantity;
    } else {
      locationData.push({ location_id: parseInt(data.to_location, 10), qty: quantity });
    }

    // Refresh location JSON field and add new location with 0 quantity if not available
    const allLocations = await locations.findAll();
    allLocations.forEach(loc => {
      if (!locationData.find(location => location.location_id === loc.location_id)) {
        locationData.push({ location_id: loc.location_id, qty: 0 });
      }
    });

    await item_master.update(
      { location: locationData },
      { where: { item_id: data.item_id }, transaction }
    );

    await createEntry(data, "remove", data.from_location, data.from_division, data.from_employee, "TRN");
    await createEntry(data, "add", data.to_location, data.to_division, data.to_employee, "REC");

    await transaction.commit();

    return { message: "Transactions recorded successfully" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error creating transactions: ${error.message}`);
  }
};