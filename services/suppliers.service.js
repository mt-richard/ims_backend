const { suppliers, divisions } = require('../models');
const { Op } = require('sequelize');

exports.getAllSuppliers = async () => {
  try {
    const items = await suppliers.findAll({
      include: [
        {
          model: divisions,
          as: 'sup_division', 
          attributes: ['division_name'], 
        },
      ],
    });

    // Transform the items to the desired format
    return items.map(item => {
      return {
        sup_id: item.sup_id,
        sup_name: item.sup_name,
        contact: item.contact,
        address: item.address,
        currency: item.currency,
        sup_type: item.sup_type,
        division_id: item.division_id,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        division_name: item.sup_division ? item.sup_division.division_name : null, 
      };
    });
  } catch (error) {
    throw new Error(`Error fetching suppliers: ${error.message}`);
  } 
};

exports.getByName = async (name) => {
  try {
    return await suppliers.findOne({ where: { sup_name: name } });
  } catch (error) {
    throw new Error(`Error fetching suppliers: ${error.message}`);
  }
};

exports.getSupplierById = async (id) => {
  try {
    return await suppliers.findOne({where: {sup_id: id }});
  } catch (error) {
    throw new Error(`Error fetching suppliers: ${error.message}`);
  }
};

exports.createSupplier = async (data) => {
  try {
    const response =  await suppliers.create(data);
    return { message: "Supplier added successfully", supplier: response };
  } catch (error) {
    throw new Error(`Error creating supplier: ${error.message}`);
  }
};

exports.deleteSupplier = async (id) => {
  try {
    let response = await suppliers.findByPk(id);
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
    let response = await suppliers.findByPk(id);
    if (!response) {
      const error = new Error(`Supplier not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'active';
    await response.save();
    return { message: "Supplier restored successfully", supplier: response };
  } catch (error) {
    throw new Error(`Error restoring suppliers: ${error.message}`);
  }
};

exports.editSupplier = async (id, name, contact, address, sup_type,  currency,division, status) => {
  try {
    let supplierData = await suppliers.findByPk(id);
    if (!supplierData) {
      const error = new Error(`Supplier not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    supplierData.sup_name = name;
    supplierData.contact = contact;
    supplierData.address = address;
    supplierData.sup_type = sup_type;
    supplierData.division = division;
    supplierData.currency = currency;
    supplierData.status = status;
    await supplierData.save();
    return { message: "Supplier updated successfully", supplier: supplierData };
  } catch (error) {
    throw new Error(`Error updating supplier: ${error.message}`);
  }
};