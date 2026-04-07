const { item_specifications } = require('../models');

exports.getSpecsByItem = async (item_id) => {
  try {
    return await item_specifications.findAll({
      where: { item_id }
    });
  } catch (error) {
    throw new Error(`Error fetching specifications: ${error.message}`);
  }
};

exports.createItemSpecs = async (item_id, specs) => {
  try {
    // specs = [{ field_id, value }]
    const data = specs.map(spec => ({
      item_id,
      field_id: spec.field_id,
      value: spec.value
    }));

    await item_specifications.bulkCreate(data);

    return { message: "Specifications added successfully" };
  } catch (error) {
    throw new Error(`Error creating specifications: ${error.message}`);
  }
};

exports.updateItemSpecs = async (item_id, specs) => {
  try {
    // remove old
    await item_specifications.destroy({ where: { item_id } });

    // insert new
    const data = specs.map(spec => ({
      item_id,
      field_id: spec.field_id,
      value: spec.value
    }));

    await item_specifications.bulkCreate(data);

    return { message: "Specifications updated successfully" };
  } catch (error) {
    throw new Error(`Error updating specifications: ${error.message}`);
  }
};


exports.deleteSpecsByItem = async (id) => {
  try {
    let field = await item_specifications.findByPk(id);
    if (!field) {
      const error = new Error(`Specifications not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    field.status = "inactive";
    await field.save();
    return { message: "Specifications deleted successfully", data: field };
  } catch (error) {
    throw new Error(`Error deleting Specifications: ${error.message}`);
  }
};

exports.restoreSpecsByItem = async (id) => {
  try {
    let field = await item_specifications.findByPk(id);
    if (!field) {
      const error = new Error(`Specifications not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    field.status = "inactive";
    await field.save();
    return { message: "Specifications restored successfully", data: field };
  } catch (error) {
    throw new Error(`Error restoring Specifications: ${error.message}`);
  }
};