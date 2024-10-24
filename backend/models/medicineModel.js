import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    dosage: {
        type: String,
        required: true,
        trim: true
    },
    intervals: {
        type : String ,
        required : true,
    }
},
    {
        timestamps: true  
    }

);

export default mongoose.model('Medicine', medicineSchema);