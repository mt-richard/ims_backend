const express = require('express');
const { getItemsInStock, getItemById, createStockItems } = require('../controllers/itemMasterController');
const router = express.Router();

router.get('/', getItemsInStock);
router.get('/:id', getItemById);
router.post('/add', createStockItems);


module.exports = router;