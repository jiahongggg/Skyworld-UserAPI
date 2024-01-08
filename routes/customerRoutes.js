const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyToken, checkAccess, checkApiAccess } = require('../middleware/authMiddleware');

// Use verifyToken for all routes in this router
router.use(verifyToken);

// Use checkApiAccess middleware for '/customers' route
router.use(checkApiAccess('customers'));

router.route('/')
  .post(checkAccess(['admin', 'editor']), customerController.createCustomer)
  .get(customerController.listAllCustomers);

router.route('/:id')
  .get(customerController.getCustomer)
  .put(checkAccess(['admin', 'editor']), customerController.updateCustomer)
  .delete(checkAccess('admin'), customerController.deleteCustomer);

module.exports = router;
