import { HttpError } from "../../errors/HttpError";
import DegreeCourseModel, { IDegreeCourseDocument } from "./DegreeCourseModel";

export async function createDegreeCourse(DegreeCourseData: {
    universityName: string;
    universityShortName: string;
    departmentName: string;
    departmentShortName: string;
    name: string;
    shortName: string;
}):Promise<IDegreeCourseDocument>{
    
    const degreeCourse = new DegreeCourseModel(DegreeCourseData);
    return await degreeCourse.save();
};

export async function getAllDegreeCourses():Promise<IDegreeCourseDocument[]>{
    return await DegreeCourseModel.find();
};

export async function getDegreeCourseByID(degreeCourseID: string):Promise<IDegreeCourseDocument>{
    const degreeCourse = await DegreeCourseModel.findById(degreeCourseID);
    if(!degreeCourse){
        console.log(`course with id ${degreeCourseID} not found`);
        throw new HttpError(404, 'course not found');
    }
    else{
        console.log(`course with id ${degreeCourseID} found`);
        return degreeCourse;
    }
}

export async function deleteDegreeCourse(degreeCourseID: string):Promise<void>{
    const degreeCourse = await DegreeCourseModel.findOneAndDelete({ _id: degreeCourseID });
    if(!degreeCourse){
        console.log(`course with id ${degreeCourseID} not found`);
        throw new HttpError(404, 'course not found');
    }
    else{
        console.log(`course with id ${degreeCourseID} found and deleted`);
    }
}

export async function updateDegreeCourse(degreeCourseID: string, degereCourseData:{
    universityName?: string;
    universityShortName?: string;
    departmentName?: string;
    departmentShortName?: string;
    name?: string;
    shortName?: string;
}):Promise<IDegreeCourseDocument>{
    const degreeCouseInDatabase = await getDegreeCourseByID(degreeCourseID);
    Object.assign(degreeCouseInDatabase,degereCourseData);
    return await degreeCouseInDatabase.save();
};