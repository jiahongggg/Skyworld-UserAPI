const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyToken, checkApiAccess } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.use(checkApiAccess('customers'));

router.route('/')
  .post(customerController.createCustomer)
  .get(customerController.listAllCustomers);

router.route('/:id')
  .get(customerController.getCustomer)
  .put(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

module.exports = router;
