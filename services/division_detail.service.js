
const { division_detail } = require('../models');
const { Op } = require('sequelize');


exports.getAllDivisionDetail = async () => {
  try {
    const response = await division_detail.findAll();
    return response;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  } 
};

exports.getByName = async (division_name) => {
  try {
    return await division_detail.findOne({ where: { division_name: division_name } });
  } catch (error) {
    throw new Error(`Error fetching division: ${error.message}`);
  }
};

exports.getDivisionById = async (id) => {
  try {
    return await division_detail.findOne({where: {sub_cat_id: id }});
  } catch (error) {
    throw new Error(`Error fetching division: ${error.message}`);
  }
};


exports.createDivisionDetail = async (data) => {
  try {
    const response =  await division_detail.create(data);
    return { message: "Division Details added successfull", division: response };
  } catch (error) {
    throw new Error(`Error cretaing division: ${error.message}`);
  }
};

exports.deleteDivisionDetail = async (id) => {
  try {
    let response = await division_detail.findByPk(id);
    if (!response) {
      const error = new Error(`Division Details not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'inactive';
    await response.save();
    return { message: "Division Details deleted successfull", division: response };
  } catch (error) {
    throw new Error(`Error deleting division: ${error.message}`);
  }
};

exports.restoreDivisionDetail = async (id) => {
  try {
    let response = await division_detail.findByPk(id);
    if (!response) {
      const error = new Error(`Division Details not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    response.status = 'active';
    await response.save();
    return { message: "Division Details restored successfull", division: response };
  } catch (error) {
    throw new Error(`Error restoring division: ${error.message}`);
  }
};

exports.editDivisionDetail = async (id, division_name,division_code,status) => {
  try {
    let divisionData = await division_detail.findByPk(id);
    if (!divisionData) {
      const error = new Error(`Division Details not found with id: ${id}`);
      error.statusCode = 404; 
      throw error;
    }
    divisionData.division_code = division_code;
    divisionData.division_name = division_name;
    divisionData.status = status;
    await divisionData.save();
    return { message: "Division Details updated successfull", division: divisionData };
  } catch (error) {
    throw new Error(`Error restoring User : ${error.message}`);
  }
};