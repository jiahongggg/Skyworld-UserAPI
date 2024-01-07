const customerModel = require('../models/customerModel');
const { v4: uuidv4 } = require('uuid');

// Define the default page size and maximum page size
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

const createCustomer = async (req, res) => {
    try {
        console.log("Received customer data:", req.body);

        if (!req.body || !req.body.CustomerLeadID) {
            return res.status(400).send({ message: 'Missing required customer data' });
        }

        // Extracting customer data from the request body
        const customerData = {
            CustomerUUID: uuidv4(),
            CustomerLeadID: req.body.CustomerLeadID, // Assuming this is provided in the request
            // ... (other customer data fields)
            Deleted: 0
        };

        await customerModel.createCustomer(customerData);

        res.status(201).send({ message: 'Customer created successfully', CustomerUUID: customerData.CustomerUUID });
    } catch (error) {
        res.status(500).send({ message: 'Error creating customer', error: error.message });
    }
};

const getCustomer = async (req, res) => {
    try {
        const customer = await customerModel.getCustomer(req.params.id);
        res.status(200).json(customer);
    } catch (error) {
        res.status(404).json({ message: 'Customer not found' });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const result = await customerModel.updateCustomer(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const result = await customerModel.deleteCustomer(req.params.id);
        res.status(200).json({ message: 'Customer deleted', result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const listAllCustomers = async (req, res) => {
    try {
        // Extract pagination parameters from the request query, defaulting to page 1 and 10 records per page
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE;

        // Ensure pageSize is within limits
        const effectivePageSize = Math.min(pageSize, MAX_PAGE_SIZE);

        const customers = await customerModel.listAllCustomers(pageNumber, effectivePageSize);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

module.exports = {
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    listAllCustomers
};
