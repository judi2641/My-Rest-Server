import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
});

afterEach(async () => {
    const db = mongoose.connection.db;
    if(db){
        const collections = await db.collections();
        for(let collection of collections){
            await collection.deleteMany({});
        }
    }
    else{
        console.log("keine datenbank");
    }
})