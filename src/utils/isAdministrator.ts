import { Request, Response, NextFunction } from "express";
import config from 'config';

export function isAdministrator(req: Request, res: Response, next: NextFunction){
    const decodedToken = (req as any).decodedToken;
    if(decodedToken.isAdministrator){
        return next();
    }
    else{
        res.status(401).json({error: "Not Authorized"});
    }
}