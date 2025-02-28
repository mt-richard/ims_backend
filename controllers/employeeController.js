const  EmployeeService = require('../services/employees.service');
const employeesService = require('../services/employees.service');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.getEmployees = async (req, res) => {
    try {
      const response = await EmployeeService.getAllEmployees();
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.createEmployee = async (req, res) => {
    try {
      const employeeData = req.body;
      const response = await employeesService.createEmployee(employeeData);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.createEmployeesFromExcel = async (req, res) => {
    try {
      const filePath = req.file.path;
      const response = await employeesService.createEmployeesFromExcel(filePath);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.getEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        const response =  await EmployeeService.getEmployeeById(id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

  exports.deleteEmployee = async (req, res) => {
    try {
      const id = req.params.id;
      const empData = await EmployeeService.deleteEmployee(id);
      res.status(200).json(empData);
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

  exports.restoreEmployee = async (req, res) => {
    try {
      const id = req.params.id;
      const empData = await EmployeeService.restoreEmployee(id);
      res.status(200).json(empData);
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

  exports.editEmployee = async (req, res) => {
    try {
      const id = req.params.id;
      const { emp_code, first_name, last_name, email, phone, location, divison, status } = req.body
      const empData = await EmployeeService.editEmployee(id, emp_code, first_name, last_name, email, phone, location, divison, status);
      res.status(200).json(empData);
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