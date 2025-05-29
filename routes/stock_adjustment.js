const express = require('express');
const { getStockAdjustments, createStockAdjustment, editStockAdjustment, approveAdjustment, rejectAdjustment } = require('../controllers/stockAdjustmentController');
const { authenticateToken } = require('../middleWares/authMiddleWare');
const router = express.Router();

router.get('/', authenticateToken, getStockAdjustments);
// router.get('/:id', getMovementById);
router.post('/add', createStockAdjustment );
router.put('/approve/:id',authenticateToken, approveAdjustment);
router.put('/reject/:id', authenticateToken, rejectAdjustment);
router.put('/edit/:id', editStockAdjustment);

module.exports = router;