const { item_transactions, item_master, locations, divisions, users, sequelize } = require('../models');

exports.getAllTransactions = async () => {
  try {
    const items = await item_transactions.findAll({
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
        transaction_id: item.transaction_id,
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

exports.getTransactionByRef = async (ref) => {
  try {
    return await item_transactions.findOne({where: {ref_no: ref }});
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

exports.getTransactionById = async (id) => {
  try {
    return await item_transactions.findOne({where: {transaction_id: id }});
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

    const lastEntry = await item_transactions.findOne({
      order: [["transaction_id", "DESC"]],
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

    const createEntry = async (item, transactionType, location, division, employee) => {
      await item_transactions.create(
        {
          item_id: item.item_id,
          location: location,
          division: division,
          employee: employee,
          quantity: transactionType === "remove" ? -quantity : quantity,
          remark: item.remark,
          ref_no: refNo,
          created_by: item.created_by,
          qty_balance: inventoryItem.quantity,
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

    await createEntry(data, "remove", data.from_location, data.from_division, data.from_employee);
    await createEntry(data, "add", data.to_location, data.to_division, data.to_employee);
    await transaction.commit();

    return { message: "Transactions recorded successfully" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error creating transactions: ${error.message}`);
  }
};
