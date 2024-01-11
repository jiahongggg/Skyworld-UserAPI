const salesModel = require('../models/salesModel');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache data for 5 minutes 

// Define the default page size and maximum page size
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

const createSales = async (req, res) => {
    try {
        console.log("Received sales data:", req.body);

        if (!req.body || !req.body.AgentName) {
            return res.status(400).send({ message: 'Missing required sales data' });
        }

        // Extracting sales data from the request body
        const salesData = {
            SalesAgentID: uuidv4(),
            AgentName: req.body.AgentName, // Assuming this is provided in the request
            AgentAge: req.body.AgentAge,
            AgentGender: req.body.AgentGender,
            AgentEmail: req.body.AgentEmail,
            AgentICPassportNo: req.body.AgentICPassportNo,
            AgentSalutation: req.body.AgentSalutation,
            AgentNationality: req.body.AgentNationality,
            AgentContactNo: req.body.AgentContactNo,
            AgentAddress: req.body.AgentAddress,
            Deleted: 0,
            CreatedBy: req.user.id,
            DateCreated: new Date(),
            ModifiedBy: null,
            DateModified: null
        };

        await salesModel.createSales(salesData);

        res.status(201).send({ message: 'Sales created successfully', SalesAgentID: salesData.SalesAgentID });
    } catch (error) {
        res.status(500).send({ message: 'Error creating sales', error: error.message });
    }
};

const getSales = async (req, res) => {
    try {
        const sales = await salesModel.getSales(req.params.id);
        res.status(200).json(sales);
    } catch (error) {
        res.status(404).json({ message: 'Sales not found' });
    }
};

const updateSales = async (req, res) => {
    try {
        const result = await salesModel.updateSales(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSales = async (req, res) => {
    try {
        const result = await salesModel.deleteSales(req.params.id);
        res.status(200).json({ message: 'Sales deleted', result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const listAllSales = async (req, res) => {
    try {
        // Extract pagination parameters from the request query, defaulting to page 1 and 10 records per page
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE;

        // Ensure pageSize is within limits
        const effectivePageSize = Math.min(pageSize, MAX_PAGE_SIZE);

        // Create a cache key based on the query parameters, including filtering and sorting
        const cacheKey = `listAllSales:${pageNumber}:${effectivePageSize}:${JSON.stringify(req.query)}`;

        // Check if the data is cached
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log('Data retrieved from cache');
            return res.status(200).json(cachedData);
        }

        const filter = {};
        let sorting = '';

        // Extract filtering and sorting parameters from the request query
        if (req.query.filterByGender) {
            filter.AgentGender = req.query.filterByGender;
        }

        if (req.query.sortByName) {
            sorting = `AgentName ${req.query.sortByName === 'asc' ? 'ASC' : 'DESC'}`;
        }

        // Fetch sales from the database with optional filtering and sorting
        const sales = await salesModel.listAllSales(
            pageNumber,
            effectivePageSize,
            filter,
            sorting
        );

        // Store the data in cache for future requests
        cache.set(cacheKey, sales);

        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales', error: error.message });
    }
};

module.exports = {
    createSales,
    getSales,
    updateSales,
    deleteSales,
    listAllSales
};
