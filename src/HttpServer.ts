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
const httpPort = 80;
const httpsPort = 443

async function startServer(){
    try{
        await initDB();
        await initAdministrator();
        httpServer.listen(httpPort, () => {
            console.log(`HTTP server is running at http://localhost:${httpPort}`);
        });
        httpsServer.listen(httpsPort, () => {
            console.log(`HTTPs server is running at https://localhost:${httpsPort}`);
        });
    }
    catch(error){
        console.error('serverstart faild', error);
    }
}

startServer();