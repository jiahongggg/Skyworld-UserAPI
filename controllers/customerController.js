const customerModel = require('../models/customerModel');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache data for 5 minutes

// Define the default page size and maximum page size
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

// Helper function to refresh the customer cache
const refreshCustomerCache = async () => {
    const customersData = await customerModel.listAllCustomers(); // Assuming this function exists in your customerModel
    cache.set('listAllCustomers', customersData);
};

const createCustomer = async (req, res) => {
    try {
        console.log("Received customer data:", req.body);

        if (!req.body || !req.body.CustomerLeadID) {
            return res.status(400).send({ message: 'Missing required customer data' });
        }

        // Extracting customer data from the request body
        const customerData = {
            CustomerUUID: uuidv4(),
            CustomerLeadID: req.body.CustomerLeadID,
            CustomerProfile: req.body.CustomerProfile,
            CustomerName: req.body.CustomerName,
            CustomerEmail: req.body.CustomerEmail,
            CustomerContactNo: req.body.CustomerContactNo,
            CustomerICPassportNo: req.body.CustomerICPassportNo,
            CustomerGender: req.body.CustomerGender,
            CustomerSalutation: req.body.CustomerSalutation,
            CustomerOccupation: req.body.CustomerOccupation,
            CustomerNationality: req.body.CustomerNationality,
            CustomerAddress: req.body.CustomerAddress,
            CustomerAddress2: req.body.CustomerAddress2,
            CustomerAddress3: req.body.CustomerAddress3,
            CustomerDateOfBirth: req.body.CustomerDateOfBirth,
            CustomerIncome: req.body.CustomerIncome,
            CustomerMaritalStatus: req.body.CustomerMaritalStatus,
            CustomerRace: req.body.CustomerRace,
            CustomerIsBumi: req.body.CustomerIsBumi,
            CustomerIsCorporate: req.body.CustomerIsCorporate,
            CustomerPreferredLanguage: req.body.CustomerPreferredLanguage,
            CustomerBeneficiaryID: req.body.CustomerBeneficiaryID,
            CustomerMotherMaidenName: req.body.CustomerMotherMaidenName,
            CustomerEmergencyContactID: req.body.CustomerEmergencyContactID,
            Remark: req.body.Remark,
            CreatedBy: req.user.id,
            DateCreated: new Date(),
            ModifiedBy: null,
            DateModified: null,
            Deleted: 0
        };

        // Create customer with checking foreign key constraints
        const result = await customerModel.createCustomer(customerData);

        // Update the cache after creating a new customer record
        await refreshCustomerCache();

        res.status(201).send({ message: 'Customer created successfully', CustomerUUID: customerData.CustomerUUID });
    } catch (error) {
        res.status(500).send({ message: 'Error creating customer', error: error.message });
    }
};

const getCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;

        // Check if the data is cached
        const cachedData = cache.get(`getCustomer:${customerId}`);

        if (cachedData) {
            console.log('Data retrieved from cache');
            return res.status(200).json(cachedData);
        }

        const customer = await customerModel.getCustomer(customerId);

        // Store the data in cache for future requests
        cache.set(`getCustomer:${customerId}`, customer);

        res.status(200).json(customer);
    } catch (error) {
        res.status(404).json({ message: 'Customer not found' });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;

        const result = await customerModel.updateCustomer(customerId, req.body);

        // Update the cache after creating a new customer record
        await refreshCustomerCache();

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;

        const result = await customerModel.deleteCustomer(customerId);

        // Update the cache after creating a new customer record
        await refreshCustomerCache();

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

        // Create a cache key based on the query parameters, including filtering and sorting
        const cacheKey = `listAllCustomers:${pageNumber}:${effectivePageSize}:${JSON.stringify(req.query)}`;

        // Check if the data is cached
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log('Data retrieved from cache');
            return res.status(200).json(cachedData);
        }

        const filter = {};
        const sort = {};

        // Extract filtering and sorting parameters from the request query
        if (req.query.filterByName) {
            filter.CustomerName = req.query.filterByName;
        }

        if (req.query.sortBy) {
            // Parse the sorting parameter to determine column and order
            sort.CustomerName = req.query.sortBy === 'asc' ? 1 : -1;
        }

        // Fetch customers from the database with optional filtering and sorting
        const customers = await customerModel.listAllCustomers(
            pageNumber,
            effectivePageSize,
            filter,
            sort
        );

        // Store the data in cache for future requests
        cache.set(cacheKey, customers);

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
