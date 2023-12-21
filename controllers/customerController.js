const customerModel = require('../models/customerModel');
const { v4: uuidv4 } = require('uuid');

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
            CustomerAddress2: req.body.CustomerAddress2, // Assuming these are optional
            CustomerAddress3: req.body.CustomerAddress3, // Assuming these are optional
            CustomerDateOfBirth: req.body.CustomerDateOfBirth,
            CustomerIncome: req.body.CustomerIncome,
            CustomerMaritalStatus: req.body.CustomerMaritalStatus,
            CustomerRace: req.body.CustomerRace,
            CustomerIsBumi: req.body.CustomerIsBumi,
            CustomerIsCorporate: req.body.CustomerIsCorporate,
            CustomerPreferredLanguage: req.body.CustomerPreferredLanguage,
            CustomerBeneficiaryID: req.body.CustomerBeneficiaryID, // Assuming this is optional or provided
            CustomerMotherMaidenName: req.body.CustomerMotherMaidenName, // Assuming this is optional
            CustomerEmergencyContactID: req.body.CustomerEmergencyContactID, // Assuming this is optional
            Remark: req.body.Remark, // Assuming this is optional
            CreatedBy: 'Developer',
            DateCreated: new Date(),
            ModifiedBy: null, // or req.body.ModifiedBy, depending on your logic
            DateModified: null, // Handle this according to your application logic
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
        const customers = await customerModel.listAllCustomers();
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
