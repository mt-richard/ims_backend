const express = require('express');
const { getPurchaseEntries, createPurchaseEntry } = require('../controllers/purchaseEntryController');
const { authenticateToken } = require('../middleWares/authMiddleWare');
const router = express.Router();

router.get('/', authenticateToken, getPurchaseEntries);
// router.get('/:id', getMovementById);
router.post('/add', createPurchaseEntry );
// router.delete('/delete/:id', deleteUser);
// router.put('/restore/:id', restoreUser);
// router.put('/edit/:id', editUser);

module.exports = router;