import express, { Request, Response} from 'express';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { createApplication, deleteApplication, getAllApplications, getApplicationByID, updateApplication } from './ApplicationsService';
import { HttpError } from '../../errors/HttpError';
import { isAdministrator } from '../../utils/isAdministrator';

const router = express();

router.get('/myApplications', isAuthenticated,  async (req: Request, res: Response) => {
    const userID = (req as any).decodedToken.userID;
    try{
        let applications = await getAllApplications();
        applications = applications.filter(a => a.applicantUserID === userID);
        res.status(200).json(applications);
    }
    catch(error){
        console.log(error);
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json({error: "An unkown error occured"});
        }
    }
});

router.get('/', isAuthenticated, isAdministrator, async(req: Request, res: Response) =>{
    try{
        const {applicantUserID, degreeCourseID, targetPeriodYear, targetPeriodShortName} = req.query;
        let applications = await getAllApplications();
        if(applicantUserID){
            applications = applications.filter(a => a.applicantUserID === applicantUserID);
        }
        if(degreeCourseID){
            applications = applications.filter(a => a.degreeCourseID === degreeCourseID);
        }
        if(targetPeriodYear){
            applications = applications.filter(a => a.targetPeriodYear === targetPeriodYear);
        }
        if(targetPeriodShortName){
            applications = applications.filter(a => a.targetPeriodShortName === targetPeriodShortName);
        }
        res.status(200).json(applications);
    }
    catch(error){
        console.log(error);
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json({error: "An unkown error  occured"});
        }
    }
});

router.post('/', isAuthenticated, async(req: Request, res: Response) => {
    const decodedToken = (req as any).decodedToken;
    try{
        let application;
        if(decodedToken.isAdministrator){
            application = await createApplication(req.body);
        }
        else{
            req.body.applicantUserID = decodedToken.userID;
            application = await createApplication(req.body);
        }
        console.log("application: " + application);
        res.status(200).json(application);
    }
    catch(error){
        console.log(error);
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json({error: 'Something went wrong'});
        }
    }
});

router.put('/:applicationID', isAuthenticated, async(req: Request, res: Response) => {
    const decodedToken = (req as any).decodedToken;
    try{
        let application = await getApplicationByID(req.params.applicationID);
        if(application.applicantUserID !== decodedToken.userID){
            res.status(401).json({error: "Only allowed to change your data"})
        }
        else if(!decodedToken.isAdministrator && (('applicantUserID' in req.body) || ('degreeCourseID' in req.body))){
            res.status(401).json({error: "Only allowed to change year and semester"});
        }
        else{
            console.log(req.params.applicantUserID);
            const application = await updateApplication(req.params.applicationID, req.body);
            res.status(200).json(application);
        }
    }
    catch(error){
        console.log(error)
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json('Something went wrong');
        }
    }
});

router.delete('/:applicationID', isAuthenticated, async(req: Request, res: Response) => {
    const decodedToken = (req as any).decodedToken;
    try{
        const application = await getApplicationByID(req.params.applicationID);
        //only delete the application if user is admin or application is from user
        if(decodedToken.isAdministrator || application.applicantUserID === decodedToken.userID){
            await deleteApplication(req.params.applicationID);
            res.sendStatus(204);
        }
        else{
            res.status(401).json({error: 'Not Allowed to delete application'});
        }
    }
    catch(error){
        console.log(error)
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json('Something went wrong');
        }   
    }
})


export default router;