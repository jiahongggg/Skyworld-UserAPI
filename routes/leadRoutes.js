const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { verifyToken, checkAccess, checkApiAccess } = require('../middleware/authMiddleware');

// Use verifyToken for all routes in this router
router.use(verifyToken);

// Use checkApiAccess middleware for '/leads' route
router.use(checkApiAccess('leads'));

router.route('/')
  .post(checkAccess('editor'), leadController.createLead)
  .get(leadController.listAllLeads);

router.route('/:id')
  .get(leadController.getLead)
  .put(checkAccess('editor'), leadController.updateLead)
  .delete(checkAccess('admin'), leadController.deleteLead);

module.exports = router;
