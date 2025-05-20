import { ApplicationModel, IApplication } from "./ApplicationModel";
import { isAuthenticated } from "../../utils/isAuthenticated";
import { HttpError } from "../../errors/HttpError";
import { DegreeCourseModel } from "../degreeCourses/DegreeCourseModel";
import { getDegreeCourseByID } from "../degreeCourses/DegreeCourseService";
import mongoose from "mongoose";
import { getUserByUserID } from "../users/UserService";

/**
 * 
 * @param ApplicationData 
 * @returns created Application if sucessfull
 */
export async function createApplication(ApplicationData: {
    applicantUserID: string;
    degreeCourseID: string;
    targetPeriodYear: string;
    targetPeriodShortName: string;
}):Promise<IApplication>{
    const application = new ApplicationModel(ApplicationData);

    //checks if ID of degreeCourse is valid and ensure that it exists
    if(!mongoose.Types.ObjectId.isValid(application.degreeCourseID)){
        console.log(`course with id ${application.degreeCourseID} not found`);
        throw new HttpError(404, 'course not found');
    }
    
    //checks if degreeCourse is in database
    await getDegreeCourseByID(application.degreeCourseID);

    //checks if user is in database
    await getUserByUserID(application.applicantUserID);

    //checks if the same application already exists
    const identifier = application.applicantUserID + application.degreeCourseID + application.targetPeriodYear + application.targetPeriodShortName;
    const existingApplication = await ApplicationModel.findOne({identifier: identifier});
    if(existingApplication){
        throw new HttpError(400, "An application already exists");
    }

    return await application.save();    
};

/**
 * @returns array of all applications, if no application was found empty array will be returned
 */
export async function getAllApplications():Promise<IApplication[]>{
    return await ApplicationModel.find();
}

/**
 * @param applicationID 
 * @returns application if ID was found
 * @throws 404 HttpError if application was not found
 */
export async function getApplicationByID(applicationID: string):Promise<IApplication>{
    const application = await ApplicationModel.findById(applicationID);
    if(!application){
        console.log(`application with id ${applicationID} not found`);
        throw new HttpError(404,"application not found");
    }
    else{
        console.log(`application with id ${applicationID} found`);
        return application;
    }
}

/**
 * uses mongoose findByIdAndDelete method 
 * @param applicationID
 * @throws 404 HttpError if applicationID was not found
 */
export async function deleteApplication(applicationID: string):Promise<void>{
    const application = await ApplicationModel.findByIdAndDelete(applicationID)
    if(!application){
        console.log(`application with id ${applicationID} not found`);
        throw new HttpError(404,"application not found");
    }
    else{
        console.log(`application with id ${applicationID} found and deleted`);
    }
}

/**
 * uses getApplicationByID to search the applicationID, so 404 HttpError could be thrown
 * if application found: object.assign and application.save()
 * @param applicationID 
 * @param applicationData 
 * @returns updated application
 */
export async function updateApplication(applicationID: string, applicationData:{
    applicantUserID?: string,
    degreeCourseID?: string;
    targetPeriodYear?: string;
    targetPeriodShortName?: string;
}):Promise<IApplication>{

    const application = await getApplicationByID(applicationID);
    Object.assign(application, applicationData);

    //checks if the same application already exists
    const identifier = application.applicantUserID + application.degreeCourseID + application.targetPeriodYear + application.targetPeriodShortName;
    const existingApplication = await ApplicationModel.findOne({identifier: identifier});
    if(existingApplication){
        throw new HttpError(400, "An application already exists");
    }
    return await application.save();
}