const express = require('express');
const { getEmployees, getEmployeeById, createEmployee, deleteEmployee, restoreEmployee, editEmployee, createEmployeesFromExcel } = require('../controllers/employeeController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = router;
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/add', createEmployee);
router.post('/add_from_excel', upload.single('file'), createEmployeesFromExcel);
router.delete('/delete/:id', deleteEmployee);
router.put('/restore/:id', restoreEmployee);
router.put('/edit/:id', editEmployee);

module.exports = router;