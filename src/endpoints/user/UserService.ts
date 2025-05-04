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
    const user = await UserModel.findOne( {userID} );
    if(!user){
        console.log(`user with userID: ${userID} not found`);
        throw new Error("User not found");
    }
    console.log(`user with userID: ${userID} found`);
    return user;
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

export async function initAdministrator(){
    const admin = await UserModel.findOne({ isAdministrator: true });
    if(admin){
        console.log("at least one admin already exist");
        return;
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


