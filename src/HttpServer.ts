import express, { Request, Response } from 'express';
import { initDB } from './database/db';
import PublicUserRoute from './endpoints/user/PublicUserRoute';


const app = express();
const port = 80;

app.use(express.json());
app.use('/api/publicUsers',PublicUserRoute);
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found"})
});

initDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`server is running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("server error because of database error",error);
    });