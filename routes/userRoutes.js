const express = require('express');
const authController = require('../controllers/authController');
const userApiController = require('../controllers/userApiController');
const { verifyToken, checkAccess } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

// Swagger Documentation for Login
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authController.loginRateLimiter, authController.login);

// Swagger Documentation for Refresh Token
/**
 * @swagger
 * /api/v1/users/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh', authController.refreshAccessToken);

// Swagger Documentation for Logout
/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: User logout
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout);

// Apply verifyToken middleware to all routes that require authentication
router.use(verifyToken);

// Swagger Documentation for Creating a User
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin, editor]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', checkAccess(['admin']), userApiController.createUser);

// Swagger Documentation for Listing All Users
/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/', checkAccess(['admin','editor']), userApiController.listUsers);

// Swagger Documentation for Getting User Details
/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get user details
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/:id', checkAccess(['admin', 'editor']), userApiController.getUserDetails);

// Swagger Documentation for Updating User Details
/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a user's information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin, editor]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', checkAccess(['admin', 'editor']), userApiController.updateUser);

// Swagger Documentation for Deleting User
/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', checkAccess(['admin']), userApiController.deleteUser);

// Swagger Documentation for Getting User Details (Duplicate Entry Removed)
/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get user details
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/:id', checkAccess(['admin', 'editor']), userApiController.getUserDetails);

// Swagger Documentation for Updating User Details (Duplicate Entry Removed)
/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a user's information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin, editor]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', checkAccess(['admin', 'editor']), userApiController.updateUser);

// Swagger Documentation for Deleting User (Duplicate Entry Removed)
/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', checkAccess(['admin']), userApiController.deleteUser);

// Swagger Documentation for Creating API Collection Group
/**
 * @swagger
 * /api/v1/users/apiCollectionGroups:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create API collection group
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Properties for creating API collection group
 *     responses:
 *       200:
 *         description: API collection group created successfully
 *       400:
 *         description: Bad request
 */
router.route('/apiCollectionGroups')
  .post(checkAccess(['admin']), userApiController.createApiCollectionGroup);

// Swagger Documentation for Assigning API Collection Group to User
/**
 * @swagger
 * /api/v1/users/userApiCollectionGroup:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Assign API collection group to user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Properties for assigning API collection group to user
 *     responses:
 *       200:
 *         description: API collection group assigned to user successfully
 *       400:
 *         description: Bad request
 */
router.route('/userApiCollectionGroup')
  .post(checkAccess(['admin']), userApiController.assignApiCollectionGroupToUser);

// Swagger Documentation for Listing User API Collection Groups
/**
 * @swagger
 * /api/v1/users/userApiCollectionGroup/{userUUID}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: List user API collection groups
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userUUID
 *         required: true
 *         description: UUID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User API collection groups retrieved successfully
 *       404:
 *         description: User not found or no API collection groups assigned
 */
router.route('/userApiCollectionGroup/:userUUID')
  .get(checkAccess(['admin', 'editor']), userApiController.listUserApiCollectionGroups);

module.exports = router;
