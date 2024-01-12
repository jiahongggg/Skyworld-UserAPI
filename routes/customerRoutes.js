const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyToken, checkAccess, checkApiAccess } = require('../middleware/authMiddleware');

// Use verifyToken for all routes in this router
router.use(verifyToken);

// Use checkApiAccess middleware for '/customers' route
router.use(checkApiAccess('customers'));

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * /customers:
 *   post:
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', checkAccess(['admin', 'editor']), customerController.createCustomer);

/**
 * @swagger
 * /customers:
 *   get:
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     summary: List all customers
 *     responses:
 *       200:
 *         description: A list of customers
 *       500:
 *         description: Server error
 */
router.get('/', customerController.listAllCustomers);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     summary: Get a specific customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the customer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *       404:
 *         description: Customer not found
 */
router.get('/:id', customerController.getCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     summary: Update a specific customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the customer to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', checkAccess(['admin', 'editor']), customerController.updateCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a specific customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the customer to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete('/:id', checkAccess('admin'), customerController.deleteCustomer);

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - CustomerLeadID
 *         - CustomerProfile
 *         - CustomerName
 *         - CustomerEmail
 *         - CustomerContactNo
 *         - CustomerICPassportNo
 *         - CustomerGender
 *         - CustomerSalutation
 *         - CustomerOccupation
 *         - CustomerNationality
 *         - CustomerAddress
 *         - CustomerStatus
 *       properties:
 *         CustomerLeadID:
 *           type: string
 *         CustomerProfile:
 *           type: string
 *         CustomerName:
 *           type: string
 *         CustomerEmail:
 *           type: string
 *         CustomerContactNo:
 *           type: string
 *         CustomerICPassportNo:
 *           type: string
 *         CustomerGender:
 *           type: string
 *         CustomerSalutation:
 *           type: string
 *         CustomerOccupation:
 *           type: string
 *         CustomerNationality:
 *           type: string
 *         CustomerAddress:
 *           type: object
 *           properties:
 *             Address:
 *               type: string
 *             Postcode:
 *               type: string
 *             City:
 *               type: string
 *             State:
 *               type: string
 *             Country:
 *               type: string
 *         CustomerDateOfBirth:
 *           type: string
 *           format: date
 *         CustomerIncome:
 *           type: number
 *           format: float
 *         CustomerMaritalStatus:
 *           type: string
 *         CustomerRace:
 *           type: string
 *         CustomerIsBumi:
 *           type: boolean
 *         CustomerIsCorporate:
 *           type: boolean
 *         CustomerPreferredLanguage:
 *           type: string
 *         CustomerBeneficiaryID:
 *           type: integer
 *         CustomerMotherMaidenName:
 *           type: string
 *         CustomerEmergencyContactID:
 *           type: integer
 *         Remark:
 *           type: string
 */

module.exports = router;
