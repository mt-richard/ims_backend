const { specification_fields, sub_categories } = require('../models'); 

exports.getAllFields = async () => {
  try {
    const fields = await specification_fields.findAll({
      include: [
        {
          model: sub_categories,
          as: 'subCategory',
          attributes: ['description'], // assuming 'description' is the name field
        },
      ],
    });

    // Transform fields to include sub_category_name
    return fields.map(field => ({
      field_id: field.field_id,
      sub_category_id: field.sub_category_id,
      field_name: field.field_name,
      field_type: field.field_type,
      is_required: field.is_required,
      status: field.status,
      created_at: field.created_at,
      updated_at: field.updated_at,
      created_by: field.created_by,
      updated_by: field.updated_by,
      sub_category_name: field.subCategory ? field.subCategory.description : null,
    }));
  } catch (error) {
    throw new Error(`Error fetching specification fields: ${error.message}`);
  }
};

exports.getFieldsBySubCategory = async (sub_category_id) => {
  try {
    return await specification_fields.findAll({
      where: { sub_category_id }
    });
  } catch (error) {
    throw new Error(`Error fetching fields: ${error.message}`);
  }
};

exports.getFieldById = async (id) => {
  try {
    return await specification_fields.findByPk(id);
  } catch (error) {
    throw new Error(`Error fetching field: ${error.message}`);
  }
};

exports.createField = async (data) => {
  try {
    const response = await specification_fields.create(data);
    return { message: "Specification field added successfully", data: response };
  } catch (error) {
    throw new Error(`Error creating field: ${error.message}`);
  }
};

exports.updateField = async (id, field_name, field_type, is_required) => {
  try {
    let field = await specification_fields.findByPk(id);
    if (!field) {
      const error = new Error(`Field not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }

    field.field_name = field_name;
    field.field_type = field_type;
    field.is_required = is_required;

    await field.save();

    return { message: "Field updated successfully", data: field };
  } catch (error) {
    throw new Error(`Error updating field: ${error.message}`);
  }
};



exports.deleteField = async (id) => {
  try {
    let field = await specification_fields.findByPk(id);
    if (!field) {
      const error = new Error(`Field not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    field.status = "inactive";
    await field.save();
    return { message: "Field deleted successfully", data: field };
  } catch (error) {
    throw new Error(`Error deleting Field: ${error.message}`);
  }
};

exports.restoreField = async (id) => {
  try {
    let field = await specification_fields.findByPk(id);
    if (!field) {
      const error = new Error(`Field not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    field.status = "active";
    await field.save();
    return { message: "Field restored successfully", data: field };
  } catch (error) {
    throw new Error(`Error restoring Field: ${error.message}`);
  }
};