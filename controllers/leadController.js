const leadModel = require('../models/leadModel');
const { v4: uuidv4 } = require('uuid');

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
            CreatedBy: 'Developer',
            DateCreated: new Date(),
            ModifiedBy: null, // or req.body.ModifiedBy, depending on your logic
            DateModified: null, // Handle this according to your application logic
            Deleted: 0
        };

        await leadModel.createLead(leadData);

        res.status(201).send({ message: 'Lead created successfully', LeadUUID: leadData.LeadUUID });
    } catch (error) {
        res.status(500).send({ message: 'Error creating lead', error: error.message });
    }
};

const getLead = async (req, res) => {
    try {
        const lead = await leadModel.getLead(req.params.id);
        res.status(200).json(lead);
    } catch (error) {
        res.status(404).json({ message: 'Lead not found' });
    }
};

const updateLead = async (req, res) => {
    try {
        const result = await leadModel.updateLead(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteLead = async (req, res) => {
    try {
        const result = await leadModel.deleteLead(req.params.id);
        res.status(200).json({ message: 'Lead deleted', result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const listAllLeads = async (req, res) => {
    try {
        const leads = await leadModel.listAllLeads();
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
