import express from 'express';
const router = express.Router();
import { getMedicine, createMedicine, updateMedicine, deleteMedicine } from '../controllers/medicineControllers.js';
import  validateToken  from '../middleware/validateToken.js';
// Define your routes here

router.use(validateToken);
router.route("/").get(getMedicine);
router.route("/create").post(createMedicine);
router.route("/:id").put(updateMedicine);
router.route("/:id").delete(deleteMedicine);

export default router;
    