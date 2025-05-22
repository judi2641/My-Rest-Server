import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { isAdministrator } from '../../utils/isAdministrator';
import { getAllUsers, createUser, getUserByUserID, deleteUserByUserID, updateUser } from './UserService';
import { HttpError } from '../../errors/HttpError';

const router = express();

router.get("/",isAuthenticated, isAdministrator, async (req: Request, res: Response) => {
    try{
        const users = await getAllUsers();
        const safeUsers = users.map((user) => {
            const safeUser = user.toSafeJSON();
            return safeUser;
        })
        const token = (req as any).token;
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json(safeUsers);
    }
    catch(error){
        console.log(error);
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json("An unkown error occured");
        }
    }
});
router.get('/:userID',isAuthenticated, async(req: Request, res: Response) => {
    try{
        const userID = req.params.userID;
        const decodedToken = (req as any).decodedToken;

        if(decodedToken.isAdministrator || decodedToken.userID == userID){
            const user = await getUserByUserID(userID);
            res.status(200).json(user.toSafeJSON());
        }
        else{
            res.status(401).json({error: "Not Authorized"});
        }
    } catch(error){
        console.log(error);
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json({error: "An unkown error occured"});
        }
    }
});
router.post('/', isAuthenticated, isAdministrator, async(req: Request, res: Response) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user.toSafeJSON()); 
    } catch (error) {
        console.log(error);
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json({error: 'An unkown error occured'});	
        }
    }
});
router.delete('/:userID', isAuthenticated, isAdministrator, async(req: Request, res: Response) => {
    try{
        await deleteUserByUserID(req.params.userID);
        res.sendStatus(204);
    }
    catch(error){
        console.log(error);
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
        }
        else{
            res.status(500).json({error: 'Unkown error occured'});
        }
    }
});
router.put('/:userID', isAuthenticated, async(req:Request, res: Response) => {
    try{
        const userID = req.params.userID;
        const decodedToken = (req as any).decodedToken;
        if(decodedToken.isAdministrator || decodedToken.userID == userID){
            //ensures that isAdministrator cannot be changed
            if(!decodedToken.isAdministrator) {
                delete req.body.isAdministrator;
            }
            const user = await updateUser(userID, req.body);
            res.status(200).json(user.toSafeJSON());
        }
        else{
            res.status(401).json({error: "Not Authorized"});
        }
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