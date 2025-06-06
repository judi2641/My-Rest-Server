import express, { Request, Response }from 'express';
import { createDegreeCourse, deleteDegreeCourse, getAllDegreeCourses, getDegreeCourseByID, updateDegreeCourse } from './DegreeCourseService';
import { HttpError } from '../../errors/HttpError';
import { isAdministrator } from '../../utils/isAdministrator';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { getApplicationsByDegreeCourseID } from '../degreeCourseApplications/ApplicationsService';

const router = express();

router.get('/',async (req: Request, res: Response) => {
    try{
        const { universityShortName } = req.query;
        let courses = await getAllDegreeCourses();
        if(universityShortName){
            courses = courses.filter(c => c.universityShortName === universityShortName);
        }
        res.status(200).json(courses);
    }
    catch(error){
        console.log(error)
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json("An unkown error occured");
        }
    }
});
//nachgelagerte Suche
router.get('/:degreeCourseID/degreeCourseApplications',isAuthenticated, isAdministrator, async (req: Request, res: Response) => {
    try{
        const course = await getDegreeCourseByID(req.params.degreeCourseID);
        const applications = await getApplicationsByDegreeCourseID(course._id);
        res.status(200).json(applications);
    }
    catch(error){
        console.log(error)
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json("Something went wrong");
        }
    }
})
router.get('/:degreeCourseID', async (req: Request, res: Response) => {
    try{
        const course = await getDegreeCourseByID(req.params.degreeCourseID);
        res.status(200).json(course);
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
router.post('/',isAuthenticated, isAdministrator, async (req: Request, res: Response) => {
    try{
        const degreeCourse = await createDegreeCourse(req.body);
        res.status(201).json(degreeCourse);
    }
    catch(error){
        console.log(error);
        if(error instanceof HttpError){
            res.status(error.status).json( {error: error.message} );
        }
        else{
            res.status(500).json({error: "An unkown error occured"});
        }
    }
});
router.put('/:degreeCourseID', isAuthenticated, isAdministrator, async (req: Request, res: Response) => {
    try{
        const degreeCourse = await updateDegreeCourse(req.params.degreeCourseID, req.body);
        res.status(200).json(degreeCourse);
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
router.delete('/:degreeCourseID', isAuthenticated, isAdministrator, async (req: Request, res: Response) => {
    try{
        await deleteDegreeCourse(req.params.degreeCourseID);
        res.sendStatus(204);
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
})
export default router;

