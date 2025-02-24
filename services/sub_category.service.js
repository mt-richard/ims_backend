
const { item_categories,sub_categories } = require('../models');
const { Op } = require('sequelize');


exports.getAllSubCategory = async () => {
  try {
    const items = await sub_categories.findAll({
      include: [
        {
          model: item_categories,
          as: 'category', 
          attributes: ['category_name'], 
        },
      ],
    });

    // Transform the items to the desired format
    return items.map(item => {
      return {
        sub_cat_id: item.sub_cat_id,
        category_id: item.category_id,
        description: item.description,
        prefix: item.prefix,
        sec_num: item.sec_num,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        category_name: item.category ? item.category.category_name : null, 
      };
    });
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  } 
};

exports.getByName = async (description) => {
  try {
    return await sub_categories.findOne({ where: { description: description } });
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

exports.getSubCategoryById = async (id) => {
  try {
    return await sub_categories.findOne({where: {sub_cat_id: id }});
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};


exports.createSubCategory = async (data) => {
  try {
    const response =  await sub_categories.create(data);
    return { message: "Sub Category added successfull", category: response };
  } catch (error) {
    throw new Error(`Error cretaing category: ${error.message}`);
  }
};

exports.deleteSubCategory = async (id) => {
  try {
    let response = await sub_categories.findByPk(id);
    if (!response) {
      const error = new Error(`Sub Category not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'inactive';
    await response.save();
    return { message: "Sub Category deleted successfull", category: response };
  } catch (error) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
};

exports.restoreSubCategory = async (id) => {
  try {
    let response = await sub_categories.findByPk(id);
    if (!response) {
      const error = new Error(`Sub Category not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'active';
    await response.save();
    return { message: "Sub Category restored successfull", category: response };
  } catch (error) {
    throw new Error(`Error restoring category: ${error.message}`);
  }
};

exports.editSubCategory = async (id, category_id,description,prefix,status) => {
  try {
    let categoryData = await sub_categories.findByPk(id);
    if (!categoryData) {
      const error = new Error(`Sub Category not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    categoryData.category_id = category_id;
    categoryData.description = description;
    categoryData.prefix = prefix;
    categoryData.status = status;
    await categoryData.save();
    return { message: "Sub Category updated successfull", category: categoryData };
  } catch (error) {
    throw new Error(`Error restoring User : ${error.message}`);
  }
};