import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String,
        enum: ['elder', 'admin' , 'caretaker'],
        default: 'elder',
    },
    permission: [{
        type: String,
        enum:[
            'view_appointments',
            'view_medicines',
            'manage_medicines',
            'manage_appointments',
            'view_elders',
            'manage_elders',
            'manage_caretakers',
            'manage_elders'
        ]
    }]
          
},
{
    timestamps: true,
}
);

userSchema.pre('save', async function(next){
    if(this.isModified('role')){
        switch(this.role){
            case 'admin':
                this.permission = [
                    'view_appointments',
                    'view_medicines',
                    'manage_medicines',
                    'manage_appointments',
                    'view_elders',
                    'manage_elders',
                    'manage_caretakers',
                    'manage_elders'
                ]
                break;
            case 'caretaker':
                this.permission = [
                    'view_appointments',
                    'view_medicines',
                    'manage_medicines',
                    'manage_appointments',
                    'view_elders',
                    'manage_elders'
                ]
                break;
            case 'elder':
                this.permission = [
                    'view_appointments',
                    'view_medicines'
                ]
                break;
                default:
                    this.permission = [
                        'view_appointments',
                        'view_medicines'];
        }
    }
    next();
   
});

export default mongoose.model("User", userSchema);