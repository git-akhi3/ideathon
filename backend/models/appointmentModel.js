import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    doctorName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps: true  
});

export default mongoose.model('Appointment', appointmentSchema);