import express, { Request, Response } from 'express';
import { initDB } from './database/db';
import PublicUserRoute from './endpoints/users/PublicUserRoute';
import AuthenticationRoute from './endpoints/authentication/AuthenticationRoute';
import { initAdministrator } from './endpoints/users/UserService';
import UserRoute from './endpoints/users/UserRoute'; 
import DegreeCourseRoute from './endpoints/degreeCourses/DegreeCourseRoute';
import ApplicationRoute from './endpoints/degreeCourseApplications/ApplicationRoute';

const app = express();
const port = 80;

app.use(express.json());
app.use('/api/publicUsers',PublicUserRoute);
app.use('/api/authenticate', AuthenticationRoute);
app.use('/api/users', UserRoute);
app.use('/api/degreeCourses', DegreeCourseRoute);
app.use('/api/degreeCourseApplications', ApplicationRoute);
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found"})
});

initDB()
    .then(async () => {
        await initAdministrator();
        app.listen(port, () => {
            console.log(`server is running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("server error because of database error",error);
    });