const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController')


router.get('/checkPhone/:phone', doctorController.checkPhone);
router.post('/addDoctorDetails', doctorController.addDoctorDetails);
router.post('/addMoreDoctorDetails', doctorController.addMoreDoctorDetails);
router.post('/login', doctorController.login);
router.post('/patientRegistration', doctorController.patientRegistration);
router.get('/getDiseases', doctorController.getDiseases);
router.get('/getTodaysPatients/:doc_id', doctorController.getTodaysPatients);
router.get('/getAllPatients/:doc_id', doctorController.getAllPatients);
router.post('/getComplications', doctorController.getComplications);
router.post('/getTests', doctorController.getTests);
router.post('/getMedicines', doctorController.getMedicines);
router.post('/prescribe', doctorController.prescribe);


module.exports = router;