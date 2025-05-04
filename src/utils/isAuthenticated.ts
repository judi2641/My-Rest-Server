import { Request, Response, NextFunction, } from "express";
import config from 'config';
import jwt from 'jsonwebtoken';

export function isAuthenticated(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        const tokenKey = config.get('session.tokenKey') as string;
        try{
            const decoded = jwt.verify(token, tokenKey, { algorithms: ["HS256"] });
            (req as any).decodedToken = decoded;
            (req as any).token = token;
            return next();
        }
        catch(error){
            console.log(error);
            res.status(401).json( {error: "Not Authorized"} );
            return;
        }
    }
    else{
        res.status(401).json( {error: 'Not Authorized'});
    }
}