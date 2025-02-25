const express = require('express');
const { getTransaction, createTransactions } = require('../controllers/itemTransferController');
const router = express.Router();

router.get('/', getTransaction);
router.post('/add', createTransactions);

module.exports = router;