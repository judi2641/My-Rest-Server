import UserModel from "./UserModel";

export async function createUser(userData: {
    userID: string;
    firstName?: string;
    lastName?: string;
    password: string;
    isAdministrator?: Boolean;
}){
    const user = new UserModel(userData);
    return await user.save();
};

export async function getAllUsers(){
    return await UserModel.find();
};

export async function getUserByUserID(userID: string){
    return await UserModel.findOne( {userID} );
};

export async function deleteUserByUserID(userID: string){
    return await UserModel.findOneAndDelete( {userID} );
};

export async function updateUser(userID: string, userData: {
    userID?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    isAdministrator?: Boolean;
}){
    return await UserModel.findOneAndUpdate( {userID} ,userData,{
        new: true, // returns object after update
        runValidators: true, // validators are checked
    });
}


