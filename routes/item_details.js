const express = require('express');
const { getItemDetails } = require('../controllers/itemDetailsController');
const router = express.Router();

router.get('/:assetId', getItemDetails);


module.exports = router;