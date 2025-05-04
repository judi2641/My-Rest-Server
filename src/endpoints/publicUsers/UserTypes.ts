import { Document } from "mongoose";

export interface IUser{
    userID: string;
    firstName?: string;
    lastName?: string;
    password: string;
    isAdministrator: boolean;
}

export interface IUserDocument extends IUser, Document{
    toSafeJSON(): TransferUser;
}

export interface TransferUser{
    userID: string;
    firstName?: string;
    lastName?: string;
    isAdministrator: boolean;
    id: string;
    accessToken: string;
    refreshToken: string;
}