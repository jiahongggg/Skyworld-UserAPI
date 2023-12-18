const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.route('/')
  .post(customerController.createCustomer)
  .get(customerController.listAllCustomers);

router.route('/:id')
  .get(customerController.getCustomer)
  .put(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

module.exports = router;
