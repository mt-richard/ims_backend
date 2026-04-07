const express = require('express');
const { createField, getAllFields, updateField, restoreField, deleteField } = require('../controllers/specification_fields.controller');
const router = express.Router();

router.get('/', getAllFields);
router.get('/:id', getAllFields);
router.post('/add', createField);
router.delete('/delete/:id', deleteField);
router.put('/restore/:id', restoreField);
router.put('/edit/:id', updateField );

module.exports = router;