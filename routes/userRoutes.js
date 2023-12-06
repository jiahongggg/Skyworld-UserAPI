const express = require('express');
const authController = require('../controllers/authController');
const userApiController = require('../controllers/userApiController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// testing
// router.post('/signup', userApiController.createUser);
router.post('/login', authController.login);

// CRUD operations
router.post('/', authenticateToken, authorizeRole('admin'), userApiController.createUser);
router.get('/:id', authenticateToken, userApiController.getUserDetails);
router.put('/:id', authenticateToken, authorizeRole('admin'), userApiController.updateUser);
router.delete('/:id', authenticateToken, authorizeRole('admin'), userApiController.deleteUser);
router.get('/', authenticateToken, authorizeRole('admin'), userApiController.listUsers);
router.post('/refresh', authController.refreshAccessToken);
router.post('/logout', authController.logout);


module.exports = router;
