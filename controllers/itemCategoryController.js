const  ItemCategoryService = require('../services/item_category.service');
// const {users} = require('../models');

exports.getCategories = async (req, res) => {
    try {
      const response = await ItemCategoryService.getAllCategory();
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.createCategory = async (req, res) => { 
    try {
        const { category_name, description, prefix, status } = req.body
        const ifExists = await ItemCategoryService.getByName(category_name)
        if (!ifExists) {
            const response = await ItemCategoryService.createCategory({ category_name, description, prefix, status})
            res.json(response);
        } else {
            res.status(200).json({message : "Item Category already exists"})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getCategoryByID = async (req, res) => {
    try {
        const id = req.params.id;
        const response =  await ItemCategoryService.getCategoryById(id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

  exports.deleteCategory = async (req, res) => {
    try {
      const id = req.params.id;
      const catData = await ItemCategoryService.deleteCategory(id);
      res.status(200).json(catData);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          error: error.message,
          
        });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };

  exports.restoreCategory = async (req, res) => {
    try {
      const id = req.params.id;
      const catData = await ItemCategoryService.restoreCategory(id);
      res.status(200).json(catData);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          error: error.message,
          
        });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };

  exports.editCategory = async (req, res) => {
    try {
      const id = req.params.id;
      const { category_name, description, prefix, status } = req.body
      const catData = await ItemCategoryService.editCategory(id, category_name, description, prefix, status);
      res.status(200).json(catData);
    } catch (error) {
      if (error.statusCode) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          error: error.message,
          
        });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  };