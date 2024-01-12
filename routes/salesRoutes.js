const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { verifyToken, checkAccess, checkApiAccess } = require('../middleware/authMiddleware');

// Use verifyToken for all routes in this router
router.use(verifyToken);

// Use checkApiAccess middleware for '/sales' route
router.use(checkApiAccess('sales'));

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sale management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sales:
 *       type: object
 *       required:
 *         - AgentName
 *         - AgentAge
 *         - AgentGender
 *         - AgentEmail
 *         - AgentICPassportNo
 *         - AgentSalutation
 *         - AgentNationality
 *         - AgentContactNo
 *         - AgentAddress
 *       properties:
 *         AgentName:
 *           type: string
 *         AgentAge:
 *           type: integer
 *         AgentGender:
 *           type: string
 *         AgentEmail:
 *           type: string
 *         AgentICPassportNo:
 *           type: string
 *         AgentSalutation:
 *           type: string
 *         AgentNationality:
 *           type: string
 *         AgentContactNo:
 *           type: string
 *         AgentAddress:
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
 *         Remark:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/sales:
 *   post:
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new sales record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sales'
 *     responses:
 *       201:
 *         description: Sales record created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', checkAccess(['admin', 'editor']), salesController.createSales);

/**
 * @swagger
 * /api/v1/sales:
 *   get:
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     summary: List all sales records
 *     responses:
 *       200:
 *         description: A list of sales records
 *       500:
 *         description: Error fetching sales records
 */
router.get('/', salesController.listAllSales);

/**
 * @swagger
 * /api/v1/sales/{id}:
 *   get:
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     summary: Get a specific sales record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the sales record
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sales record retrieved successfully
 *       404:
 *         description: Sales record not found
 */
router.get('/:id', salesController.getSales);

/**
 * @swagger
 * /api/v1/sales/{id}:
 *   put:
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     summary: Update a specific sales record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the sales record
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sales'
 *     responses:
 *       200:
 *         description: Sales record updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', checkAccess(['admin', 'editor']), salesController.updateSales);

/**
 * @swagger
 * /api/v1/sales/{id}:
 *   delete:
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a specific sales record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the sales record
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sales record deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete('/:id', checkAccess('admin'), salesController.deleteSales);

module.exports = router;
