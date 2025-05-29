const express = require('express');
const { getDivisionDetails, createDivisionDetail, editDivisionDetail, restoreDivisionDetail, deleteDivisionDetail, getDivisionByID } = require('../controllers/divisionDetailController');
const router = express.Router();

router.get('/', getDivisionDetails);
router.get('/:id', getDivisionByID);
router.post('/add', createDivisionDetail);
router.delete('/delete/:id', deleteDivisionDetail);
router.put('/restore/:id', restoreDivisionDetail);
router.put('/edit/:id', editDivisionDetail);

module.exports = router;