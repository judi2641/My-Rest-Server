import { UserModel, IUserDocument } from './UserModel';
import bcryptjs from 'bcryptjs';
import { HttpError } from '../../errors/HttpError';

export async function createUser(userData: {
    userID?: string;
    firstName?: string;
    lastName?: string;
    password: string;
    isAdministrator?: boolean;
}):Promise<IUserDocument>{
    try{
        const user = new UserModel(userData);
        return await user.save();
    }
    catch(error){
        console.error("Error creating user:", error);
        throw new HttpError(400, "Failed to create user");
    }
}
export async function getAllUsers():Promise<IUserDocument[]>{
    return await UserModel.find();
};
/**
 * throws an error if the user is not in the database
 * @returns user when the user is found
 */
export async function getUserByUserID(userID: string): Promise<IUserDocument>{
    const user = await UserModel.findOne( {userID} );
    if(!user){
        console.log(`user with userID: ${userID} not found`);
        throw new HttpError(404, "user not found");
    }
    console.log(`user with userID:${userID} found`);
    return user;
};
/**
 * throws an error if user not found in database
 */
export async function deleteUserByUserID(userID: string):Promise<void>{
    const user = await UserModel.findOneAndDelete( {userID} );
    if(!user){
        console.log(`user with userID:${userID} not found`);
        throw new HttpError(404, "user not found");
    }
    console.log(`user with userID:${userID} found and deleted`);
};
/**
 * throws error if you want to change the userID
 */
export async function updateUser(userID: string, userData: {
    userID?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    isAdministrator?: boolean;
}):Promise<IUserDocument> {
    const userInDatabase = await getUserByUserID(userID);
    if(userData.userID && userID != userData.userID){
        console.log(`request to change userID of user:${userID} in userID: ${userData.userID} -- not allowed`);
        throw new HttpError(400, "do not change the userID");
    }
    if(userData.password){
        const isSamePassword = await bcryptjs.compare(userData.password, userInDatabase.password);
        if(isSamePassword){
            console.log("the new password is the same as the passwort in database -- skipping new password hash");
            delete userData.password;
        }
    }
    Object.assign(userInDatabase,userData);
    return await userInDatabase.save();
}
export async function initAdministrator():Promise<void>{
    const admin = await UserModel.findOne({ isAdministrator: true });
    if(admin){
        console.log("at least one admin already exist");
    }
    else{
        console.log("no admin exist. creating a default admin");
        const defaultAdmin = new UserModel({
            userID: "admin",
            password: "123",
            isAdministrator: true
        });
        defaultAdmin.save();
        console.log("created default admin with userID: 'admin' and password 'password'")
    }
}


