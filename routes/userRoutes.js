const express = require('express');
const authController = require('../controllers/authController');
const userApiController = require('../controllers/userApiController');
const { verifyToken, checkAccess, checkApiAccess } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authController.loginRateLimiter, authController.login);
router.post('/refresh', authController.refreshAccessToken);
router.post('/logout', authController.logout);

router.route('/')
  .post(verifyToken, checkAccess(['admin']), userApiController.createUser)
  .get(verifyToken, checkAccess(['admin', 'editor']), userApiController.listUsers);

router.route('/:id')
  .get(verifyToken, checkAccess(['admin', 'editor']), userApiController.getUserDetails)
  .put(verifyToken, checkAccess(['admin', 'editor']), userApiController.updateUser)
  .delete(verifyToken, checkAccess(['admin']), userApiController.deleteUser);

router.route('/apiCollectionGroups')
  .post(verifyToken, checkAccess(['admin']), userApiController.createApiCollectionGroup);
  // .get(verifyToken, checkAccess(['admin', 'editor']), userApiController.listApiCollectionGroups);

router.route('/userApiCollectionGroup')
  .post(verifyToken, checkAccess(['admin']), userApiController.assignApiCollectionGroupToUser);

router.route('/userApiCollectionGroup/:userUUID')
  .get(verifyToken, checkAccess(['admin', 'editor']), userApiController.listUserApiCollectionGroups);

router.route('/customers-api')
  .get(checkApiAccess('customers'), (req, res) => {
    // Your customers API logic
  });

router.route('/leads-api')
  .get(checkApiAccess('leads'), (req, res) => {
    // Your leads API logic
  });

router.route('/sales-api')
  .get(checkApiAccess('sales'), (req, res) => {
    // Your sales API logic
  });

module.exports = router;
