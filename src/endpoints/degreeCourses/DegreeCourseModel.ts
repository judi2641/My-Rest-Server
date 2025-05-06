import mongoose from "mongoose";

const DegreeCourseSchema = new mongoose.Schema({
    universityName: { type: String, required: true },
    universityShortName: { type: String, required: true },
    departmentName: { type: String, required: true },
    departmentShortName: { type: String, required: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
});

DegreeCourseSchema.methods.toJSON = function (){
    const degreeCourse = this.toObject();
    degreeCourse.id = degreeCourse._id;
    delete degreeCourse._id;
    delete degreeCourse.__v;
    return degreeCourse;
}
const DegreeCourseModel = mongoose.model('DegreeCourse', DegreeCourseSchema);
export default DegreeCourseModel;