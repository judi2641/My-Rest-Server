import mongoose, { Document }from "mongoose";

const DegreeCourseSchema = new mongoose.Schema({
    universityName: { type: String, required: true },
    universityShortName: { type: String, required: true },
    departmentName: { type: String, required: true },
    departmentShortName: { type: String, required: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
});

export interface IDegreeCourseDocument extends Document{
    universityName: string;
    universityShortName: string;
    departmentName: string;
    departmentShortName: string;
    name: string;
    shortName: string;
}

DegreeCourseSchema.methods.toJSON = function (){
    const degreeCourse = this.toObject();
    degreeCourse.id = degreeCourse._id;
    delete degreeCourse._id;
    delete degreeCourse.__v;
    return degreeCourse;
}
export const DegreeCourseModel = mongoose.model<IDegreeCourseDocument>('DegreeCourse', DegreeCourseSchema);