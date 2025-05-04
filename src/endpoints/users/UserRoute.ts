import express, { NextFunction, Request, Response } from 'express';
import { isAuthenticated } from '../../utils/isAuthenticated';
import { isAdministrator } from '../../utils/isAdministrator';
import { getAllUsers } from './UserService';

const router = express();

router.get("/",isAuthenticated, isAdministrator, async (req: Request, res: Response) => {
    const users = await getAllUsers();
    const safeUsers = users.map((user) => {
        const safeUser = user.toSafeJSON();
        return safeUser;
    })
    //muss man immer token mitschicken?
    const token = (req as any).token;
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json(safeUsers);
})

export default router;