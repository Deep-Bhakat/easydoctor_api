const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController')


router.get('/checkPhone/:phone', doctorController.checkPhone);
router.post('/addDoctorDetails', doctorController.addDoctorDetails);
router.post('/addMoreDoctorDetails', doctorController.addMoreDoctorDetails);
router.post('/login', doctorController.login);
router.post('/patientRegistration', doctorController.patientRegistration);
router.get('/getDiseases', doctorController.getDiseases);
// router.post('/getTodaysPatients', doctorController.getTodaysPatients);
// router.post('/getAllPatients', doctorController.getAllPatients);


module.exports = router;