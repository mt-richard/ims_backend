const express = require('express');
const { getStockMovements, getStockMovementsByItem } = require('../controllers/stockMovementsController');
const router = express.Router();

router.get('/', getStockMovements);
router.get('/byItem', getStockMovementsByItem);


module.exports = router;