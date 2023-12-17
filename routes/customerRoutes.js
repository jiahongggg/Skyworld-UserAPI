const express = require('express');
const customerController = require('../controllers/customerController');
const { verifyToken, checkAccess, checkGroupAccess } = require('../middleware/authMiddleware');

const router = express.Router();

// Assuming 'groupId' is the API collection group ID parameter in the route

router.get('/customers', customerController.listCustomers);

// router.route('/customers')
//   .post(verifyToken, checkAccess(['admin', 'editor']), checkGroupAccess, customerController.createCustomer)
//   .get(verifyToken, checkAccess(['admin', 'editor']), checkGroupAccess, customerController.listCustomers);

// router.route('/customers/:customerUUID')
//   .get(verifyToken, checkAccess(['admin', 'editor']), checkGroupAccess, customerController.getCustomer)
//   .put(verifyToken, checkAccess(['admin', 'editor']), checkGroupAccess, customerController.updateCustomer)
//   .delete(verifyToken, checkAccess(['admin']), checkGroupAccess, customerController.deleteCustomer);

module.exports = router;
