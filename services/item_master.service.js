const { item_master, item_categories, sub_categories, users, locations,division_detail, suppliers, sequelize } = require('../models');

exports.getAllItemsInStock = async () => {
  try {
    const items = await item_master.findAll({
      include: [
        {
          model: sub_categories,
          as: 'category',
          attributes: ['description'],
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
          attributes: ['description'],
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
      sup_name: item.supplier?.sup_name || null,
      location_name: item.location_use?.location_name || null,
      division_name: item.division_belong?.division_name || null,
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
    return { message: "Item added successfully", item: response };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Error creating item: ${error.message}`);
  }
};

exports.deleteSupplier = async (id) => {
  try {
    let response = await item_master.findByPk(id);
    if (!response) {
      const error = new Error(`Supplier not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    response.status = 'inactive';
    await response.save();
    return { message: "Supplier deleted successfully", supplier: response };
  } catch (error) {
    throw new Error(`Error deleting supplier: ${error.message}`);
  }
};

exports.restoreSupplier = async (id) => {
  try {
    let response = await item_master.findByPk(id);
    if (!response) {
      const error = new Error(`Supplier not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    response.status = 'active';
    await response.save();
    return { message: "Supplier restored successfully", supplier: response };
  } catch (error) {
    throw new Error(`Error restoring item_master: ${error.message}`);
  }
};

exports.editSupplier = async (id, name, contact, status) => {
  try {
    let supplierData = await item_master.findByPk(id);
    if (!supplierData) {
      const error = new Error(`Supplier not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    supplierData.sup_name = name;
    supplierData.contact = contact;
    supplierData.status = status;
    await supplierData.save();
    return { message: "Supplier updated successfully", supplier: supplierData };
  } catch (error) {
    throw new Error(`Error updating supplier: ${error.message}`);
  }
};