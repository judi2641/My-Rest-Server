import express, { Request, Response } from 'express';
import { authenticate } from './AuthenticationService';
import { HttpError } from '../../errors/HttpError';

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try{
        if(!req.headers.authorization || req.headers.authorization.indexOf('Basic')===-1){
            res.status(400);
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            res.json({error: 'missing authentication header'});
        }
        else{
            //teilt authentication header und nimmt anmeldedaten
            const base64Credentials = req.headers.authorization.split(' ')[1];
            //wandelt codierte anmeldetdaten in string um
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            //passwort und username sind mit doppeltpunkt getrennt
            const [userID, password] = credentials.split(':');

            const { safeUser, token } = await authenticate(userID, password);
            

            res.setHeader('Authorization', `Bearer ${token}`);
            res.status(200).json(safeUser);
        }
    }
    catch (error){
        if(error instanceof HttpError){
            res.status(error.status).json({error: error.message});
            return;
        }
        res.status(500).json({error: 'unkown error occured'});
    }
});
export default router;