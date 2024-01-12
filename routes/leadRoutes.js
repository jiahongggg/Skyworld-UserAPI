const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { verifyToken, checkAccess, checkApiAccess } = require('../middleware/authMiddleware');

// Use verifyToken for all routes in this router
router.use(verifyToken);

// Use checkApiAccess middleware for '/leads' route
router.use(checkApiAccess('leads'));

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management
 */

/**
 * @swagger
 * /leads:
 *   post:
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new lead
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lead'
 *     responses:
 *       201:
 *         description: Lead created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', checkAccess(['admin', 'editor']), leadController.createLead);

/**
 * @swagger
 * /leads:
 *   get:
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     summary: List all leads
 *     responses:
 *       200:
 *         description: A list of leads
 *       500:
 *         description: Server error
 */
router.get('/', leadController.listAllLeads);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     summary: Get a specific lead
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the lead
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead retrieved successfully
 *       404:
 *         description: Lead not found
 */
router.get('/:id', leadController.getLead);

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     summary: Update a specific lead
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the lead to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lead'
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', checkAccess(['admin', 'editor']), leadController.updateLead);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a specific lead
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the lead to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete('/:id', checkAccess('admin'), leadController.deleteLead);

/**
 * @swagger
 * components:
 *   schemas:
 *     Lead:
 *       type: object
 *       required:
 *         - LeadName
 *         - LeadEmail
 *         - LeadContactNo
 *         - LeadICPassportNo
 *         - LeadGender
 *         - LeadSalutation
 *         - LeadOccupation
 *         - LeadNationality
 *         - LeadAddress
 *         - LeadStatus
 *         - LeadDateOfBirth
 *         - LeadIncome
 *         - LeadMaritalStatus
 *         - LeadRace
 *         - LeadIsBumi
 *         - LeadIsExistingBuyer
 *         - LeadTag
 *       properties:
 *         LeadName:
 *           type: string
 *         LeadEmail:
 *           type: string
 *         LeadContactNo:
 *           type: string
 *         LeadICPassportNo:
 *           type: string
 *         LeadGender:
 *           type: string
 *         LeadSalutation:
 *           type: string
 *         LeadOccupation:
 *           type: string
 *         LeadNationality:
 *           type: string
 *         LeadAddress:
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
 *         LeadStatus:
 *           type: integer
 *         LeadDateOfBirth:
 *           type: string
 *           format: date
 *         LeadIncome:
 *           type: number
 *           format: float
 *         LeadMaritalStatus:
 *           type: string
 *         LeadRace:
 *           type: string
 *         LeadIsBumi:
 *           type: integer
 *         LeadIsExistingBuyer:
 *           type: integer
 *         LeadTag:
 *           type: integer
 *         Remark:
 *           type: string
 */

module.exports = router;
