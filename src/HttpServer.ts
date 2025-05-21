import express, { Request, Response } from 'express';
import { initDB } from './database/db';
import PublicUserRoute from './endpoints/users/PublicUserRoute';
import AuthenticationRoute from './endpoints/authentication/AuthenticationRoute';
import { initAdministrator } from './endpoints/users/UserService';
import UserRoute from './endpoints/users/UserRoute'; 
import DegreeCourseRoute from './endpoints/degreeCourses/DegreeCourseRoute';
import ApplicationRoute from './endpoints/degreeCourseApplications/ApplicationRoute';
import { readFileSync } from 'fs';
import https from 'https';
import http from 'http';

const key = readFileSync('./certificates/key.pem');
const cert = readFileSync('./certificates/cert.pem');
const app = express();


app.use(express.json());
app.use('/api/publicUsers',PublicUserRoute);
app.use('/api/authenticate', AuthenticationRoute);
app.use('/api/users', UserRoute);
app.use('/api/degreeCourses', DegreeCourseRoute);
app.use('/api/degreeCourseApplications', ApplicationRoute);
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found"})
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer({key: key, cert: cert},app);

async function startServer(){
    try{
        await initDB();
        await initAdministrator();
        httpServer.listen(8080, () => {
            console.log('HTTP server is running at http://localhost:8080')
        });
        httpsServer.listen(3443, () => {
            console.log('HTTPs server is running at https://localhost:3443')
        });
    }
    catch(error){
        console.error('serverstart faild', error);
    }
}

startServer();