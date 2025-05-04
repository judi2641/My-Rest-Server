import { createUser, getAllUsers, getUserByUserID, deleteUserByUserID, updateUser } from "./UserService";
import express, { Request, Response } from 'express';

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
	try {
		const user = await createUser(req.body);
        res.status(201).json(user); 
	} catch (error) {
		res.status(400).json({error: 'error creating a user'});
	}
});

router.get("/", async (req: Request, res: Response) =>{
	try{
		const users = await getAllUsers();
		res.status(200).json(users);
	}
	catch(error){
		res.status(400).json({error: 'error getting all users'});
	}
});

router.get('/:userID', async (req: Request, res: Response) =>{
	try{
		const user = await getUserByUserID(req.params.userID);
		res.status(200).json(user);	
	}
	catch(error){
		if(error instanceof Error){
			res.status(400).json({error: 'error getting user by id'});	
		}
		else{
			res.status(500).json({error: 'Unkown error occured'});
		}
	}
});

router.delete('/:userID', async (req: Request, res: Response) =>{
	try{
		const deleteUser = await deleteUserByUserID(req.params.userID);
		if(deleteUser){
			res.sendStatus(204);
		}
		else{
			res.status(404).json({error: `Error: Could not find User: ${req.params.userID}`});
		}
	}
	catch(error){
		res.status(400).json({error: 'error deleting user'})
	}
});

router.put('/:userID', async(req: Request, res: Response) => {
	try{
		const modifiedUser = await updateUser(req.params.userID, req.body);
		if(modifiedUser){
			res.status(200).json(modifiedUser);
		}
		else{
			res.status(404).json({error: `Error: Could not find User: ${req.params.userID}`});
		}
	}
	catch(error) {
		//da bei findOneAndUpdate viele verschiedene Fehler autreten können, hier errormessage ausgeben
		//dafür muss error vom typ Error sein
		if(error instanceof Error) {
			res.status(400).json( {error: error.message})
		}
		else{
			res.status(500).json({error: 'Unkown error occured'});
		}
	}
});

export default router;
