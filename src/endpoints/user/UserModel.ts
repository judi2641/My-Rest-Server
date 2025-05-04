import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    userID: {type: String, required: true, unique: true, immutable: true},
    firstName: String,
    lastName: String,
    password: {type: String, required: true},
    isAdministrator: {type: Boolean, default: false}
});

UserSchema.set('toJSON', {
    transform: function(doc,ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

UserSchema.pre('save', async function() {
    //document middleware untersützt save() methode
    //man kann mit .this auf das aktuelle document zugreifen
    if(this.isModified('password')){
        console.log('password is being updated -- new password hash');
        this.password = await bcryptjs.hash(this.password,10);
    }
});

delete mongoose.models.User;
const UserModel = mongoose.model('User', UserSchema);


export default UserModel;