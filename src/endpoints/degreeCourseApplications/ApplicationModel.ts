import mongoose, { Document } from "mongoose";

export interface IApplication extends Document{
    applicantUserID: string;
    degreeCourseID: string;
    targetPeriodYear: string;
    targetPeriodShortName: string;
    identifier: string;
}

const ApplicationSchema = new mongoose.Schema({
    applicantUserID: { type: String, required: true },
    degreeCourseID: { type: String, required: true },
    targetPeriodYear: { type: String, required: true },
    targetPeriodShortName: { type: String, required: true },
    identifier: { type: String, required: true, unique: true}
});

ApplicationSchema.methods.toJSON = function(){
    const application = this.toObject();
    const { _id, __v, identifier, ... rest } = application;
    rest.id = _id;
    return rest;
}

export const ApplicationModel = mongoose.model<IApplication>('Application', ApplicationSchema);