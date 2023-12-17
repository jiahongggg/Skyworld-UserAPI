const customerModel = require('../models/customerModel');

const createCustomer = async (req, res) => {
  try {
    await customerModel.createCustomer(req.body);
    res.status(201).json({ message: 'Customer created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await customerModel.getCustomer(req.params.customerUUID);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    await customerModel.updateCustomer(req.params.customerUUID, req.body);
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await customerModel.deleteCustomer(req.params.customerUUID);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const listCustomers = async (req, res) => {
  try {
    const customers = await customerModel.listCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  listCustomers
};
