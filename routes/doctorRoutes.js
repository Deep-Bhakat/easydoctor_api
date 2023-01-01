const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController')


router.get('/checkPhone/:phone', doctorController.checkPhone);


module.exports = router;