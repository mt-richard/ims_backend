const express = require('express');
const { getItemsInStock, getItemById, createStockItems, updateItem, deleteItem, restoreItem } = require('../controllers/itemMasterController');
const { authenticateToken } = require('../middleWares/authMiddleWare');
const router = express.Router();

router.get('/', authenticateToken, getItemsInStock);
router.get('/:id', authenticateToken,getItemById);
router.post('/add',authenticateToken, createStockItems);
router.put('/edit/:id', authenticateToken, updateItem);
router.delete('/delete/:id', authenticateToken, deleteItem);
router.put('/restore/:id', authenticateToken, restoreItem);


module.exports = router;