const customerModel = require('../models/customerModel');

const createCustomer = async (req, res) => {
    try {
        const result = await customerModel.createCustomer(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
