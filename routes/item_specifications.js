const express = require('express');
const { getSpecsByItem, createSpecs, deleteSpecs, updateSpecs, restoreSpecs } = require('../controllers/item_specifications.controller');
const router = express.Router();

router.get('/:id', getSpecsByItem);
router.post('/add', createSpecs);
router.delete('/delete/:id', deleteSpecs);
router.put('/restore/:id', restoreSpecs);
router.put('/edit/:id', updateSpecs );

module.exports = router;