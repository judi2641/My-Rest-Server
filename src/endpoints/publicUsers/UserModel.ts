import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import { IUserDocument, TransferUser } from "./UserTypes";

const UserSchema = new mongoose.Schema<IUserDocument>({
    userID: {type: String, required: true, unique: true, immutable: true},
    firstName: String,
    lastName: String,
    password: {type: String, required: true},
    isAdministrator: {type: Boolean, default: false}
});

UserSchema.methods.toSafeJSON = function (): TransferUser {
    const user = this.toObject();
    delete user.password;
    user.id = user._id;
    delete user._id;
    delete user.__v;
    return user;
  };

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
const UserModel = mongoose.model<IUserDocument>('User', UserSchema);


export default UserModel;