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
        this.password = await bcryptjs.hash(this.password,10);
    }
});

UserSchema.pre('findOneAndUpdate', async function (next) {
    //'findOneAndUpdte wird nicht von document mitddleware untersützt'
    //mit .this bekommt man nur die query
    //getUpdate gibt die änderung als JSON object zurück
    const update = this.getUpdate() as any;

    const newUserID = update.userID;
    if(newUserID) throw new Error("Do not change the UserID");

    const newPassword = update.password;
    if (!newPassword) return next();
  
    const userInDatabase = await this.model.findOne(this.getQuery());
    if (!userInDatabase) throw new Error("User not in Database");
  
    const isSamePassword = await bcryptjs.compare(newPassword, userInDatabase.password);
    if (isSamePassword) throw new Error("Change your password");

    update.password = await bcryptjs.hash(newPassword, 10);
    return next();
  });
  
delete mongoose.models.User;
const UserModel = mongoose.model('User', UserSchema);


export default UserModel;