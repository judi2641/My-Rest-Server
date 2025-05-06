import { HttpError } from "../../errors/HttpError";
import { createUser, getAllUsers, getUserByUserID, deleteUserByUserID, updateUser } from "./UserService";
import express, { Request, Response } from 'express';

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
	try {
		const user = await createUser(req.body);
        res.status(201).json(user); 
	} catch (error) {
		if(error instanceof HttpError){
			res.status(error.status).json({error: error.message});
		}
		else{
			res.status(500).json({error: 'An unkown error occured'});	
		}
	}
});

router.get("/", async (req: Request, res: Response) =>{
	try{
		const users = await getAllUsers();
		res.status(200).json(users);
	}
	catch(error){
		if(error instanceof HttpError){
			res.status(error.status).json({error: error.message});
		}
		else{
			res.status(500).json({error: 'An unkown error occured'});
		}
	}
});

router.get('/:userID', async (req: Request, res: Response) =>{
	try{
		const user = await getUserByUserID(req.params.userID);
		res.status(200).json(user);	
	}
	catch(error){
		if(error instanceof HttpError){
			res.status(error.status).json({error: error.message});
		}
		else{
			res.status(500).json({error: 'An unkown error occured'});	
		}
	}
});

router.delete('/:userID', async (req: Request, res: Response) =>{
	try{
		await deleteUserByUserID(req.params.userID);
		res.sendStatus(204);
	}
	catch(error){
		if(error instanceof HttpError){
			res.status(error.status).json({error: error.message});
		}
		else{
			res.status(500).json({error: 'Unkown error occured'});
		}
	}
});

router.put('/:userID', async(req: Request, res: Response) => {
	try{
		const modifiedUser = await updateUser(req.params.userID, req.body);
		res.status(200).json(modifiedUser);
	}
	catch(error) {
		if(error instanceof HttpError) {
			res.status(error.status).json( {error: error.message})
		}
		else{
			res.status(500).json({error: 'Unkown error occured'});
		}
	}
});

export default router;
