
const { locations,divisions } = require('../models');
const { Op } = require('sequelize');


exports.getAllDivision = async () => {
  try {
    const items = await divisions.findAll({
      include: [
        {
          model: locations,
          as: 'location', 
          attributes: ['location_name'], 
        },
      ],
    });

    // Transform the items to the desired format
    return items.map(item => {
      return {
        division_id: item.division_id,
        location_id: item.location_id,
        division_name: item.division_name,
        division_code: item.division_code,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        location_name: item.location ? item.location.location_name : null, 
      };
    });
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  } 
};

exports.getByName = async (division_name) => {
  try {
    return await divisions.findOne({ where: { division_name: division_name } });
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

exports.getDivisionById = async (id) => {
  try {
    return await divisions.findOne({where: {sub_cat_id: id }});
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};


exports.createDivision = async (data) => {
  try {
    const response =  await divisions.create(data);
    return { message: "Sub Category added successfull", category: response };
  } catch (error) {
    throw new Error(`Error cretaing category: ${error.message}`);
  }
};

exports.deleteDivision = async (id) => {
  try {
    let response = await divisions.findByPk(id);
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

exports.restoreDivision = async (id) => {
  try {
    let response = await divisions.findByPk(id);
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

exports.editDivision = async (id, division_name,division_code,location_id,status) => {
  try {
    let categoryData = await divisions.findByPk(id);
    if (!categoryData) {
      const error = new Error(`Sub Category not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    categoryData.location_id = location_id;
    categoryData.division_code = division_code;
    categoryData.division_name = division_name;
    categoryData.status = status;
    await categoryData.save();
    return { message: "Sub Category updated successfull", category: categoryData };
  } catch (error) {
    throw new Error(`Error restoring User : ${error.message}`);
  }
};