import asyncHandler from 'express-async-handler';
import Appointment from '../models/appointmentModel.js';

// This function gets all the appointments for a specific user
export const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ user_id: req.user._id });

    if (!appointments) {
        res.status(404);
        throw new Error('Appointments not found');
    }

    res.json(appointments);
});

// This function creates a new appointment entry for a user
export const createAppointment = asyncHandler(async (req, res) => {
    const { appointmentDate, doctorName, location } = req.body;

    if (!appointmentDate || !doctorName || !location) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    try {
        const appointment = await Appointment.create({
            appointmentDate,
            doctorName,
            location,
            user_id: req.user._id
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(400);
        throw new Error('Error creating appointment: ' + error.message);
    }
});

// This function updates an existing appointment entry
export const updateAppointment = asyncHandler(async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedAppointment);
    } catch (error) {
        res.status(400);
        throw new Error('Error updating appointment: ' + error.message);
    }
});

// This function deletes an appointment entry
export const deleteAppointment = asyncHandler(async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }

        await appointment.deleteOne();

        res.json({ message: 'Appointment removed' });
    } catch (error) {
        res.status(400);
        throw new Error('Error deleting appointment: ' + error.message);
    }
});