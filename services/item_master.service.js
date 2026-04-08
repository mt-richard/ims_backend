const { item_master, item_categories, sub_categories, users, locations,division_detail, suppliers, sequelize } = require('../models');

exports.getAllItemsInStock = async () => {
  try {
    const items = await item_master.findAll({
      include: [
        {
          model: sub_categories,
          as: 'category',
          attributes: ['description','category_id'],
        },
        {
          model: suppliers,
          as: 'supplier',
          attributes: ['sup_name'],
        },
        {
          model: locations,
          as: 'location_use',
          attributes: ['location_name'],
        },
        {
          model: division_detail,
          as: 'division_belong',
          attributes: ['division_name'],
        },
      ],
    });

    // Transform the items to the desired format
    return items.map(item => {
      return {
        item_id: item.item_id,
        sub_category_id: item.sub_category_id,
        item_category: item.item_category,
        item_name: item.item_name,
        description: item.description,
        cost: item.cost,
        bin_location: item.bin_location,
        taxable: item.taxable,
        division: item.division,
        quantity: item.quantity,
        unit: item.unit,
        supplier_id: item.supplier_id,
        location: item.location,
        cost: item.cost,
        bin_location: item.bin_location,
        taxable: item.taxable,
        asset_id: item.asset_id,
        item_status: item.item_status,
        status: item.status,
        license_start_time: item.license_start_time,
        license_expire_time: item.license_expire_time,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        category_name: item.category ? item.category.description : null,
        category_id: item.category ? item.category.category_id : null,
        sup_name: item.supplier ? item.supplier.sup_name : null,
        location_name: item.location_use ? item.location_use.location_name : null,
        item_type: item.item_type,
      };
    });
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};


exports.getItemsInStockByDiv = async (userId) => {
  try {
    const user = await users.findOne({
      where: { user_id: userId },
    });

    if (!user) throw new Error('User not found');

    const queryOptions = {
      include: [
        {
          model: sub_categories,
          as: 'category',
          attributes: ['description','category_id'],
        },
        {
          model: suppliers,
          as: 'supplier',
          attributes: ['sup_name'],
        },
        {
          model: locations,
          as: 'location_use',
          attributes: ['location_name'],
        },
        {
          model: division_detail,
          as: 'division_belong',
          attributes: ['division_name'],
        },
      ],
    };

    if (user.role !== 'admin') {
      queryOptions.where = {
        division: user.division,
      };
    }

    const items = await item_master.findAll(queryOptions);

    return items.map(item => ({
      item_id: item.item_id,
      sub_category_id: item.sub_category_id,
      item_name: item.item_name,
      description: item.description,
      cost: item.cost,
      bin_location: item.bin_location,
      taxable: item.taxable,
      division: item.division,
      quantity: item.quantity,
      unit: item.unit,
      supplier_id: item.supplier_id,
      location: item.location,
      asset_id: item.asset_id,
      item_status: item.item_status,
      status: item.status,
      license_start_time: item.license_start_time,
      license_expire_time: item.license_expire_time,
      created_at: item.created_at,
      updated_at: item.updated_at,
      created_by: item.created_by,
      updated_by: item.updated_by,
      category_name: item.category?.description || null,
      category_id: item.category?.category_id || null,
      sup_name: item.supplier?.sup_name || null,
      location_name: item.location_use?.location_name || null,
      item_type: item.item_type,
    }));
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};


exports.getItemById = async (id) => {
  try {
    return await item_master.findOne({ where: { item_id: id } });
  } catch (error) {
    throw new Error(`Error fetching inventory items: ${error.message}`);
  }
};

exports.getByName = async (name) => {
  try {
    return await item_master.findOne({ where: { item_name: name } });
  } catch (error) {
    throw new Error(`Error fetching items: ${error.message}`);
  }
};

// exports.createItems = async (data) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const category = await item_categories.findOne({
//       where: { category_id: data.item_category },
//       attributes: ['category_name', 'prefix'],
//       transaction,
//     });

//     if (!category) {
//       throw new Error("Category not found.");
//     }

//     const categoryPrefix = category.prefix;

//     const subCategory = await sub_categories.findOne({
//       where: { sub_cat_id: data.sub_category_id },
//       attributes: ['description', 'prefix', 'sec_num'],
//       transaction,
//     });


//     if (!subCategory) {
//       throw new Error("Subcategory not found.");
//     }

//     const subCategoryPrefix = subCategory.prefix;
//     const secNum = subCategory.sec_num + 1;

//     const assetId = `ABG${categoryPrefix}${subCategoryPrefix}${secNum}`;

//     await sub_categories.update(
//       { sec_num: secNum },
//       { where: { sub_cat_id: data.sub_category_id }, transaction }
//     );

//     const itemData = {
//       ...data,
//       asset_id: assetId,
//     };

//     const response = await item_master.create(itemData, { transaction });

//     await transaction.commit();
//     return { message: "Item added successfully", item: response };
//   } catch (error) {
//     await transaction.rollback();
//     throw new Error(`Error creating item: ${error.message}`);
//   }
// };

exports.createItems = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const category = await item_categories.findOne({
      where: { category_id: data.item_category },
      attributes: ['category_name', 'prefix'],
      transaction,
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    const categoryPrefix = category.prefix;

    const subCategory = await sub_categories.findOne({
      where: { sub_cat_id: data.sub_category_id },
      attributes: ['description', 'prefix', 'sec_num'],
      transaction,
    });

    if (!subCategory) {
      throw new Error("Subcategory not found.");
    }

    const subCategoryPrefix = subCategory.prefix;
    const secNum = subCategory.sec_num + 1;

    const assetId = `ABG${categoryPrefix}${subCategoryPrefix}${secNum}`;

    await sub_categories.update(
      { sec_num: secNum },
      { where: { sub_cat_id: data.sub_category_id }, transaction }
    );

    const itemData = {
      ...data,
      asset_id: assetId,
    };

    const response = await item_master.create(itemData, { transaction });

    await transaction.commit();

    return {
      message: "Item added successfully",
      item_id: response.item_id,   
      item: response              
    };

  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error creating item: ${error.message}`);
  }
};

exports.deleteItem = async (id) => {
  try {
    let response = await item_master.findByPk(id);
    if (!response) {
      const error = new Error(`Item not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    response.status = 'inactive';
    await response.save();
    return { message: "Item deleted successfully", item: response };
  } catch (error) {
    throw new Error(`Error deleting item: ${error.message}`);
  }
};

exports.restoreItem = async (id) => {
  try {
    let response = await item_master.findByPk(id);
    if (!response) {
      const error = new Error(`Item not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    response.status = 'active';
    await response.save();
    return { message: "Item restored successfully", item: response };
  } catch (error) {
    throw new Error(`Error restoring item: ${error.message}`);
  }
};


exports.updateItem = async (itemId, data) => {
  const transaction = await sequelize.transaction();

  try {
    // Check if item exists
    const existingItem = await item_master.findOne({
      where: { item_id: itemId },
      transaction,
    });

    if (!existingItem) {
      throw new Error("Item not found.");
    }

    // Whitelist allowed fields
    const allowedFields = [
      "item_name",
      "description",
      "item_type",
      "item_category",
      "sub_category_id",
      "unit",
      "division",
      "license_start_time",
      "license_expire_time"
    ];

    const updateData = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields provided to update.");
    }

    // Perform update
    await item_master.update(updateData, {
      where: { item_id: itemId },
      transaction,
    });

    // Fetch updated item
    const updatedItem = await item_master.findOne({
      where: { item_id: itemId },
      transaction,
    });

    await transaction.commit();

    return {
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    };

  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error updating item: ${error.message}`);
  }
};
