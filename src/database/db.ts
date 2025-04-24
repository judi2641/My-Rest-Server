import mongoose from "mongoose";
import config from "config";

let _db: mongoose.Connection | null = null;

const connectionString = config.get("db.connectionString") as string;

export async function initDB(): Promise<void>{
    if(_db){
        return;
    }
    else{
        try{
            await mongoose.connect(connectionString);
            _db = mongoose.connection;
            console.log("database connected");
        }
        catch(error){
            console.error("error connecting to database");
            throw error;
        }
    }
}
