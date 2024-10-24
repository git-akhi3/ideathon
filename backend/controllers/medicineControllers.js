import asyncHandler from 'express-async-handler';
import Medicine from '../models/medicineModel.js';

// This function gets all the medicines for a specific user
export const getMedicine = async(req, res) => {
    // Find all medicines that belong to the user
    const medicine = await Medicine.find({ user_id: req.user._id });
    
    // If no medicines are found, return a 404 error
    if (!medicine) {
        res.status(404);
        throw new Error('Medicine not found');
    }
    
    // Return the found medicines as a JSON response
    res.json(medicine);
};

// This function creates a new medicine entry for a user
export const createMedicine = async(req, res) => {
    // Extract data from the request body
    const { name, dosage, intervals , user_id} = req.body;
    console.log('Request Body:', req.body);
    console.log('Extracted Data:', { name, dosage, intervals }); 

    // Validate the extracted data
    if (!name || !dosage || !intervals ) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    try {
        // Create a new medicine entry in the database
        const medicine = await Medicine.create({
            name,
            dosage,
            intervals,
            user_id : req.user._id
        });
        
        // Return the created medicine as a JSON response with a 201 status
        res.status(201).json(medicine);
    } catch (error) {
        // If there's an error, return a 400 status and an error message
        res.status(400);
        throw new Error('Error creating medicine: ' + error.message);
    }
};

// This function updates an existing medicine entry
export const updateMedicine = async(req, res) => {
    try {
        // Find the medicine entry by its ID
        const medicine = await Medicine.findById(req.params.id);
        
        // If the medicine is not found, return a 404 error
        if (!medicine) {
            res.status(404);
            throw new Error('Medicine not found');
        }

        // Update the medicine entry with new data and return the updated entry
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        // Return the updated medicine as a JSON response
        res.json(updatedMedicine);
    } catch (error) {
        // If there's an error, return a 400 status and an error message
        res.status(400);
        throw new Error('Error updating medicine: ' + error.message);
    }
};

// This function deletes a medicine entry
export const deleteMedicine = async(req, res) => {
    try {
        // Find the medicine entry by its ID
        const medicine = await Medicine.findById(req.params.id);
        
        // If the medicine is not found, return a 404 error
        if (!medicine) {
            res.status(404);
            throw new Error('Medicine not found');
        }

        // Delete the medicine entry
        await medicine.deleteOne();
        
        // Return a success message as a JSON response
        res.json({ message: 'Medicine removed' });
    } catch (error) {
        // If there's an error, return a 400 status and an error message
        res.status(400);
        throw new Error('Error deleting medicine: ' + error.message);
    }
    
};