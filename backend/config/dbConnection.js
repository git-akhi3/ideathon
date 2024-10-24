import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        // Check if CONNECTION_STRING exists
        if (!process.env.CONNECTION_STRING) {
            throw new Error('MongoDB connection string is not defined in environment variables');
        }

        // Connect without deprecated options
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        
        console.log('Successfully connected to MongoDB:', 
            connect.connection.host,
            connect.connection.name
        );
    } catch (error) {
        console.log('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

export default dbConnection;