import express from 'express';
const router = express.Router();
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js';
import validateToken from '../middleware/validateToken.js';

// Define your routes here

router.use(validateToken);
router.route("/").get(getAppointments);
router.route("/create").post(createAppointment);
router.route("/:id").put(updateAppointment);
router.route("/:id").delete(deleteAppointment);

export default router;