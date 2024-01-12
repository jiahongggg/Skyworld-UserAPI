const leadModel = require('../models/leadModel');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache data for 5 minutes 

// Define the default page size and maximum page size
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

// Invalidate cache for a specific lead
const invalidateLeadCache = (leadId) => {
    const cacheKey = `getLead:${leadId}`;
    cache.del(cacheKey);
};

// Invalidate all lead list cache entries
const invalidateLeadListCache = () => {
    cache.flushAll();
};


const createLead = async (req, res) => {
    try {
        console.log("Received lead data:", req.body);

        if (!req.body || !req.body.LeadStatus) {
            return res.status(400).send({ message: 'Missing required lead data' });
        }

        // Extracting lead data from the request body
        const leadData = {
            LeadUUID: uuidv4(),
            LeadName: req.body.LeadName,
            LeadEmail: req.body.LeadEmail,
            LeadContactNo: req.body.LeadContactNo,
            LeadICPassportNo: req.body.LeadICPassportNo,
            LeadGender: req.body.LeadGender,
            LeadSalutation: req.body.LeadSalutation,
            LeadOccupation: req.body.LeadOccupation,
            LeadNationality: req.body.LeadNationality,
            LeadAddress: req.body.LeadAddress,
            LeadStatus: req.body.LeadStatus,
            LeadDateOfBirth: req.body.LeadDateOfBirth,
            LeadIncome: req.body.LeadIncome,
            LeadMaritalStatus: req.body.LeadMaritalStatus,
            LeadRace: req.body.LeadRace,
            LeadIsBumi: req.body.LeadIsBumi,
            LeadInterestType1: req.body.LeadInterestType1,
            LeadInterestType2: req.body.LeadInterestType2,
            LeadIsExistingBuyer: req.body.LeadIsExistingBuyer,
            LeadTag: req.body.LeadTag,
            Remark: req.body.Remark,
            CreatedBy: req.user.id,
            DateCreated: new Date(),
            ModifiedBy: null,
            DateModified: null,
            Deleted: 0
        };

        await leadModel.createLead(leadData);

        invalidateLeadListCache();

        res.status(201).send({ message: 'Lead created successfully', LeadUUID: leadData.LeadUUID });
        // Update the cache after creating a new lead record
        cache.del('listAllLeads'); // Delete the cached data to refresh it
    } catch (error) {
        res.status(500).send({ message: 'Error creating lead', error: error.message });
    }
};

const getLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const cacheKey = `getLead:${leadId}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log('Data retrieved from cache');
            return res.status(200).json(cachedData);
        }

        const lead = await leadModel.getLead(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        cache.set(cacheKey, lead);
        res.status(200).json(lead);
    } catch (error) {
        res.status(404).json({ message: 'Error fetching lead data', error: error.message });
    }
};

const updateLead = async (req, res) => {
    try {
        const leadId = req.params.id;

        const result = await leadModel.updateLead(leadId, req.body);

        invalidateLeadCache(leadId);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteLead = async (req, res) => {
    try {
        const leadId = req.params.id;

        const result = await leadModel.deleteLead(leadId);

        invalidateLeadCache(leadId);

        res.status(200).json({ message: 'Lead deleted', result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const listAllLeads = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = Math.min(parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const leads = await leadModel.listAllLeads(pageNumber, pageSize);

        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads', error: error.message });
    }
};

module.exports = {
    createLead,
    getLead,
    updateLead,
    deleteLead,
    listAllLeads
};
