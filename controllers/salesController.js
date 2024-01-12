const salesModel = require('../models/salesModel');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache data for 5 minutes 

// Define the default page size and maximum page size
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

// Invalidate cache for a specific sales
const invalidateSalesCache = (salesId) => {
    const cacheKey = `getSales:${salesId}`;
    cache.del(cacheKey);
};

// Invalidate all sales list cache entries
const invalidateSalesListCache = () => {
    cache.flushAll();
};

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

        invalidateSalesListCache();

        res.status(201).send({ message: 'Sales created successfully', SalesAgentID: salesData.SalesAgentID });

    } catch (error) {
        res.status(500).send({ message: 'Error creating sales', error: error.message });
    }
};

const getSales = async (req, res) => {
    try {
        const salesId = req.params.id;
        const cacheKey = `getSales:${salesId}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            console.log('Data retrieved from cache');
            return res.status(200).json(cachedData);
        }

        const sales = await salesModel.getSales(salesId);
        if (!sales) {
            return res.status(404).json({ message: 'Sales not found' });
        }
        cache.set(cacheKey, sales);
        res.status(200).json(sales);
    } catch (error) {
        res.status(404).json({ message: 'Error fetching sales data', error: error.message });
    }
};

const updateSales = async (req, res) => {
    try {
        const salesId = req.params.id;

        const result = await salesModel.updateSales(salesId, req.body);

        invalidateSalesCache(salesId);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSales = async (req, res) => {
    try {
        const salesId = req.params.id;

        const result = await salesModel.deleteSales(salesId);

        invalidateSalesCache(salesId);

        res.status(200).json({ message: 'Sales deleted', result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const listAllSales = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = Math.min(parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const sales = await salesModel.listAllSales(pageNumber, pageSize);

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
