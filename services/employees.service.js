const { employees, locations, division_detail } = require('../models');
const { Op } = require('sequelize');
const xlsx = require('xlsx');

exports.getAllEmployees = async () => {
  try {
    const items = await employees.findAll({
      include: [
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
        emp_id: item.emp_id,
        emp_code: item.emp_code,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        phone: item.phone,
        location_id: item.location,
        division_id: item.division,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        division_name: item.division_belong ? item.division_belong.division_name : null,
        location_name: item.location_use ? item.location_use.location_name : null,
      };
    });
  } catch (error) {
    throw new Error(`Error fetching employees: ${error.message}`);
  }
};

exports.getByCode = async (code) => {
  try {
    return await employees.findOne({ where: { emp_code: code } });
  } catch (error) {
    throw new Error(`Error fetching employees: ${error.message}`);
  }
};

exports.getEmployeeById = async (id) => {
  try {
    return await employees.findOne({ where: { emp_id: id } });
  } catch (error) {
    throw new Error(`Error fetching employees: ${error.message}`);
  }
};

exports.createEmployee = async (data) => {
  try {
    const response = await employees.create(data);
    return { message: "Employee added successfully", Employee: response };
  } catch (error) {
    throw new Error(`Error creating Employee: ${error.message}`);
  }
};

exports.createEmployeesFromExcel = async (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const employeesData = rows.map(row => ({
      emp_code: row.emp_code,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: row.phone,
      location: row.location,
      division: row.division,
      status: row.status,
      created_by: row.created_by,
      updated_by: row.updated_by,
    }));

    const response = await employees.bulkCreate(employeesData);
    return { message: "Employees added successfully from Excel file", Employees: response };
  } catch (error) {
    throw new Error(`Error creating Employees from Excel file: ${error.message}`);
  }
};

exports.deleteEmployee = async (id) => {
  try {
    let response = await employees.findByPk(id);
    if (!response) {
      const error = new Error(`Employee not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    response.status = 'inactive';
    await response.save();
    return { message: "Employee deleted successfully", Employee: response };
  } catch (error) {
    throw new Error(`Error deleting Employee: ${error.message}`);
  }
};

exports.restoreEmployee = async (id) => {
  try {
    let response = await employees.findByPk(id);
    if (!response) {
      const error = new Error(`Employee not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    response.status = 'active';
    await response.save();
    return { message: "Employee restored successfully", Employee: response };
  } catch (error) {
    throw new Error(`Error restoring employees: ${error.message}`);
  }
};

exports.editEmployee = async (id, emp_code, first_name, last_name, email, phone, status) => {
  try {
    let EmployeeData = await employees.findByPk(id);
    if (!EmployeeData) {
      const error = new Error(`Employee not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    EmployeeData.emp_code = emp_code;
    EmployeeData.first_name = first_name;
    EmployeeData.last_name = last_name;
    EmployeeData.email = email;
    EmployeeData.phone = phone;
    EmployeeData.status = status;
    await EmployeeData.save();
    return { message: "Employee updated successfully", Employee: EmployeeData };
  } catch (error) {
    throw new Error(`Error updating Employee: ${error.message}`);
  }
};