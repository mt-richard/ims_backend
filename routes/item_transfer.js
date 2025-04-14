const express = require('express');
const { getTransaction, createTransactions } = require('../controllers/itemTransferController');
const { authenticateToken } = require('../middleWares/authMiddleWare');
const router = express.Router();

router.get('/', authenticateToken, getTransaction);
router.post('/add', createTransactions);

module.exports = router;