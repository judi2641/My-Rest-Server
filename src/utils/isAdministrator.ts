import { Request, Response, NextFunction } from "express";

export function isAdministrator(req: Request, res: Response, next: NextFunction){
    const decodedToken = (req as any).decodedToken;
    if(decodedToken.isAdministrator){
        return next();
    }
    else{
        console.log("user hat keine adminrechte");
        res.status(401).json({error: "Not Authorized"});
    }
}