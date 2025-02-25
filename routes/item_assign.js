const express = require('express');
const { getAllAssignments, createItemAssign, getAssignmentsByItemId } = require('../controllers/itemAssignController');
const router = express.Router();

router.get('/', getAllAssignments);
router.get('/:itemId', getAssignmentsByItemId);
router.post('/', createItemAssign);

module.exports = router;