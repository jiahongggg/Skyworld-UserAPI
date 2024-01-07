const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { verifyToken, checkAccess, checkApiAccess } = require('../middleware/authMiddleware');

// Use verifyToken for all routes in this router
router.use(verifyToken);

// Use checkApiAccess middleware for '/sales' route
router.use(checkApiAccess('sales'));

router.route('/')
  .post(checkAccess('editor'), salesController.createSales)
  .get(salesController.listAllSales);

router.route('/:id')
  .get(salesController.getSales)
  .put(checkAccess('editor'), salesController.updateSales)
  .delete(checkAccess('admin'), salesController.deleteSales);

module.exports = router;
