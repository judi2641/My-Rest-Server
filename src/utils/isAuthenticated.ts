import { Request, Response, NextFunction, } from "express";
import config from 'config';
import jwt from 'jsonwebtoken';

/**
 * checks if user has valid token and adds the decodedToken and the token to request.
 * @param req 
 * @param res 
 * @param next 
 * @throws 401 HttpError if request has no token or token is not valid
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        const tokenKey: string = config.get('session.tokenKey');
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
        console.log("request hat keinen athentication header");
        res.status(401).json( {error: 'Not Authorized'});
    }
}