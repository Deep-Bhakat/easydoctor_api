const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController')


router.get('/checkPhone/:phone', doctorController.checkPhone);
router.post('/addDoctorDetails', doctorController.addDoctorDetails);


module.exports = router;