const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const UserActivityController = require('../controllers/userActivityController');

const router = express.Router();

router.get('/assets/in-use', dashboardController.getAssetInUse);
router.get('/assets/in-stock', dashboardController.getAssetInstock);
router.get('/assets/scrapped', dashboardController.getAssetscrapped);
router.get('/assets/lost', dashboardController.getAssetLost);
router.get('/licenses/details', dashboardController.getLicenceDeatils);
// router.get('/api/user-activities', UserActivityController.getUserActivities);


module.exports = router;
