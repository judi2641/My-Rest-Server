import { Document } from "mongoose";

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
 * interface zum transfer des users. beitzt zusätzliche felder für token, aber keins für das passwort
 */
export interface TransferUser{
    userID: string;
    firstName?: string;
    lastName?: string;
    isAdministrator: boolean;
    id: string;
    accessToken: string;
    refreshToken: string;
}