const customerModel = require('../models/customerModel');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache data for 5 minutes

// Define the default page size and maximum page size
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

// Invalidate cache for a specific customer
const invalidateCustomerCache = (customerId) => {
    const cacheKey = `getCustomer:${customerId}`;
    cache.del(cacheKey);
};

// Invalidate all customer list cache entries
const invalidateCustomerListCache = () => {
    cache.flushAll();
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
        await customerModel.createCustomer(customerData);

        invalidateCustomerListCache();

        res.status(201).send({ message: 'Customer created successfully', CustomerUUID: customerData.CustomerUUID });
    } catch (error) {
        res.status(500).send({ message: 'Error creating customer', error: error.message });
    }
};

const getCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const cacheKey = `getCustomer:${customerId}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        const customer = await customerModel.getCustomer(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        cache.set(cacheKey, customer);
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer data', error: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;

        const result = await customerModel.updateCustomer(customerId, req.body);

        invalidateCustomerCache(customerId);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;

        const result = await customerModel.deleteCustomer(customerId);

        invalidateCustomerCache(customerId);

        res.status(200).json({ message: 'Customer deleted', result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const listAllCustomers = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = Math.min(parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const customers = await customerModel.listAllCustomers(pageNumber, pageSize);

        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer list', error: error.message });
    }
};

module.exports = {
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    listAllCustomers
};
