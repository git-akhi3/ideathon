import express from 'express';
import dotenv from 'dotenv';
import medicineRoutes from './routes/medicineRoutes.js'; // Update the import statement
import dbConnection from './config/dbConnection.js'; // Import the function
import userRoutes from './routes/userRoutes.js'; // Update the import statement
import appointmentRoutes from './routes/appointmentRoutes.js'; // Update the import statement
dotenv.config();
const app = express();
dbConnection(); 
const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/api/medicines", medicineRoutes); 
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes); 

app.listen(port ,() => {
    console.log(`Server is running on port ${port}`);
});