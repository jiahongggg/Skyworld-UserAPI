const express = require('express');
const authController = require('../controllers/authController');
const userApiController = require('../controllers/userApiController');
const { verifyToken, checkAccess } = require('../middleware/authMiddleware');

const router = express.Router();

// Login routes without the verifyToken middleware
router.post('/login', authController.loginRateLimiter, authController.login);
router.post('/refresh', authController.refreshAccessToken);
router.post('/logout', authController.logout);

// Apply verifyToken middleware to all other routes
router.use(verifyToken);

// Routes with common middleware
router.route('/')
  .post(checkAccess(['admin']), userApiController.createUser)
  .get(checkAccess(['admin', 'editor']), userApiController.listUsers);

router.route('/:id')
  .get(checkAccess(['admin', 'editor']), userApiController.getUserDetails)
  .put(checkAccess(['admin', 'editor']), userApiController.updateUser)
  .delete(checkAccess(['admin']), userApiController.deleteUser);

router.route('/apiCollectionGroups')
  .post(checkAccess(['admin']), userApiController.createApiCollectionGroup);
// .get(checkAccess(['admin', 'editor']), userApiController.listApiCollectionGroups);

router.route('/userApiCollectionGroup')
  .post(checkAccess(['admin']), userApiController.assignApiCollectionGroupToUser);

router.route('/userApiCollectionGroup/:userUUID')
  .get(checkAccess(['admin', 'editor']), userApiController.listUserApiCollectionGroups);

module.exports = router;
