const express = require('express');
const reportController = require('./../controllers/reportController');
const authController = require('./../controllers/authController');


const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
// other user
router.use(authController.restrictTo('user'));
router.post('/createReport', reportController.createReport);




module.exports = router;