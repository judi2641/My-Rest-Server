import mongoose, { Document, ObjectId } from "mongoose";

export interface IApplication extends Document{
    applicantUserID: string;
    degreeCourseID: string;
    targetPeriodYear: string;
    targetPeriodShortName: string;
    identifier: string;
    _id: ObjectId;
}

const ApplicationSchema = new mongoose.Schema({
    applicantUserID: { type: String, required: true },
    degreeCourseID: { type: String, required: true },
    targetPeriodYear: { type: String, required: true },
    targetPeriodShortName: { type: String, required: true },
    identifier: { type: String, unique: true},
});

ApplicationSchema.methods.toJSON = function(){
    const application = this.toObject();
    const { _id, __v, identifier, ... rest } = application;
    rest.id = _id;
    return rest;
}


ApplicationSchema.pre<IApplication>('save', function (next) {
  if (
    this.isModified("applicantUserID") ||
    this.isModified("degreeCourseID") ||
    this.isModified("targetPeriodYear") ||
    this.isModified("targetPeriodShortName")
  ) {
    this.identifier =
      this.applicantUserID +
      this.degreeCourseID +
      this.targetPeriodYear +
      this.targetPeriodShortName;
  }
  next();
});

export const ApplicationModel = mongoose.model<IApplication>('Application', ApplicationSchema);