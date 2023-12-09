const express = require('express');
const customerEmergencyController = require('../controllers/customerEmergencyController');
const router = express.Router();

router.post('/', customerEmergencyController.createEmergencyContact);
router.get('/:emergencyId', customerEmergencyController.getEmergencyContact);
router.put('/:emergencyId', customerEmergencyController.updateEmergencyContact);
router.delete('/:emergencyId', customerEmergencyController.deleteEmergencyContact);

module.exports = router;
