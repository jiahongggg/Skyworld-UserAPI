const customerEmergencyModel = require('../models/customerEmergencyModel');

// Handle creation of emergency contact
async function createEmergencyContact(req, res) {
    try {
        // Check if at least one contact detail is provided
        if (!req.body.EmergencyContactNo && !req.body.EmergencyEmail) {
            return res.status(400).json({ message: 'Either EmergencyContactNo or EmergencyEmail must be provided' });
        }

        const emergencyId = await customerEmergencyModel.createEmergencyContact(req.body);
        res.status(201).json({ message: 'Emergency contact created successfully', EmergencyID: emergencyId });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// Retrieve an emergency contact by ID
async function getEmergencyContact(req, res) {
    try {
        const emergencyContact = await customerEmergencyModel.getEmergencyContactById(req.params.emergencyId);
        if (!emergencyContact) {
            return res.status(404).json({ message: 'Emergency contact not found' });
        }
        res.json(emergencyContact);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// Update an emergency contact
async function updateEmergencyContact(req, res) {
    try {
        // Check if at least one contact detail is provided
        if (!req.body.EmergencyContactNo && !req.body.EmergencyEmail) {
            return res.status(400).json({ message: 'Either EmergencyContactNo or EmergencyEmail must be provided' });
        }

        await customerEmergencyModel.updateEmergencyContact(req.params.emergencyId, req.body);
        res.json({ message: 'Emergency contact updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// Delete (soft delete) an emergency contact
async function deleteEmergencyContact(req, res) {
    try {
        await customerEmergencyModel.deleteEmergencyContact(req.params.emergencyId);
        res.json({ message: 'Emergency contact marked as deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    createEmergencyContact,
    getEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact
};
