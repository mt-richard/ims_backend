const express = require('express');
const { getItemsInStock, getItemById, createStockItems } = require('../controllers/itemMasterController');
const { authenticateToken } = require('../middleWares/authMiddleWare');
const router = express.Router();

router.get('/', authenticateToken, getItemsInStock);
router.get('/:id', getItemById);
router.post('/add', createStockItems);


module.exports = router;