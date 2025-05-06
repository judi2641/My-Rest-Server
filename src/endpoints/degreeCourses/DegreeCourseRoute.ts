import express, { Request, Response }from 'express';
import { createDegreeCourse, getAllDegreeCourses, getDegreeCourseByID, updateDegreeCourse } from './DegreeCourseService';
import { HttpError } from '../../errors/HttpError';
import { isAdministrator } from '../../utils/isAdministrator';
import { isAuthenticated } from '../../utils/isAuthenticated';

const router = express();

router.get('/',async (req: Request, res: Response) => {
    console.log(req.query);
    const { universityShortName } = req.query;
    let courses = await getAllDegreeCourses();
    console.log(universityShortName);
    if(universityShortName){
        console.log("bin im filter");
        courses = courses.filter(c => c.universityShortName === universityShortName);
        console.log(courses);
    }
    res.status(200).json(courses);
});

router.get('/:degreeCourseID', async (req: Request, res: Response) => {
    try{
        const course = await getDegreeCourseByID(req.params.degreeCourseID);
        res.status(200).json(course);
    }
    catch(error){
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
    }
});

router.post('/',isAuthenticated, isAdministrator, async (req: Request, res: Response) => {
    try{
        const degreeCourse = await createDegreeCourse(req.body);
        res.status(200).json(degreeCourse);
    }
    catch(error){
        if(error instanceof HttpError){
            res.status(error.status).json( {error: error.message} );
        }
    }
});

router.put('/:degreeCourseID', isAuthenticated, isAdministrator, async (req: Request, res: Response) => {
    try{
        const degreeCourse = await updateDegreeCourse(req.params.degreeCourseID, req.body);
        res.status(200).json(degreeCourse);
    }
    catch(error){
        if(error instanceof HttpError){
            res.status(error.status).json( {error: error.message} );
        }
    }
})

export default router;

