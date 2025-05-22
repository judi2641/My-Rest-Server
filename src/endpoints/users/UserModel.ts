import mongoose, { Document} from "mongoose";
import bcryptjs from 'bcryptjs';

/**
 * interface für den user wie er in der datenbank liegt
 */
export interface IUser{
    userID: string;
    firstName?: string;
    lastName?: string;
    password: string;
    isAdministrator: boolean;
}
/**
 * interface zum umgang mit dem user in der API. braucht methode, die den user safe zum transfer macht
 */
export interface IUserDocument extends IUser, Document{
    toSafeJSON(): TransferUser;
    toJSON(): IUser;
}
/**
 * interface zum transfer des users. kein feld für das passwort
 */
export interface TransferUser{
    userID: string;
    firstName?: string;
    lastName?: string;
    isAdministrator: boolean;
    id: string;
}
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
UserSchema.methods.toJSON = function (): IUser{
    const user = this.toObject();
    user.id = user._id;
    delete user._id;
    delete user.__v;
    return user;
}
UserSchema.pre('save', async function() {
    //document middleware untersützt save() methode
    //man kann mit .this auf das aktuelle document zugreifen
    if(this.isModified('password')){
        console.log('password is being updated -- new password hash');
        this.password = await bcryptjs.hash(this.password,10);
    }
});
delete mongoose.models.User;
export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);