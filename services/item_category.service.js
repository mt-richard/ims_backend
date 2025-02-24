
const { item_categories } = require('../models');
const { Op } = require('sequelize');


exports.getAllCategory = async () => {
  try {
    return await item_categories.findAll();
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  } 
};

exports.getByName = async (name) => {
  try {
    return await item_categories.findOne({ where: { category_name: name } });
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

exports.getCategoryById = async (id) => {
  try {
    return await item_categories.findOne({where: {category_id: id }});
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};


exports.createCategory = async (data) => {
  try {
    const response =  await item_categories.create(data);
    return { message: "Category added successfull", category: response };
  } catch (error) {
    throw new Error(`Error cretaing category: ${error.message}`);
  }
};

exports.deleteCategory = async (id) => {
  try {
    let response = await item_categories.findByPk(id);
    if (!response) {
      const error = new Error(`Item Category not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'inactive';
    await response.save();
    return { message: "Category deleted successfull", category: response };
  } catch (error) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
};

exports.restoreCategory = async (id) => {
  try {
    let response = await item_categories.findByPk(id);
    if (!response) {
      const error = new Error(`Item Category not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'active';
    await response.save();
    return { message: "Category restored successfull", category: response };
  } catch (error) {
    throw new Error(`Error restoring category: ${error.message}`);
  }
};

exports.editCategory = async (id, name, description, prefix, status) => {
  try {
    let categoryData = await item_categories.findByPk(id);
    if (!categoryData) {
      const error = new Error(`Item Category not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    categoryData.category_name = name;
    categoryData.description = description;
    categoryData.prefix = prefix;
    categoryData.status = status;
    await categoryData.save();
    return { message: "Category updated successfull", category: categoryData };
  } catch (error) {
    throw new Error(`Error restoring User : ${error.message}`);
  }
};