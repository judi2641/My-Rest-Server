import { getUserByUserID } from "../users/UserService";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HttpError } from "../../errors/HttpError";
import config from 'config';
/**
 * throws error if authentication
 * @returns safeUser object and token if authentication was sucessfull
 */
export async function authenticate(userID: string, password: string){
    try{
        const user = await getUserByUserID(userID);
        const checkCredentials = await bcryptjs.compare(password, user.password);
        if(!checkCredentials) {
            console.log("authentication failed")
            throw new HttpError(401, 'Failed to create a token: Authentication failed');
        }
        console.log("authentication sucessfull -- creating a token");
        const token = jwt.sign(
            {
                userID: user.userID,
                isAdministrator: user.isAdministrator
            },
            config.get<string>('session.tokenKey'),
            {
                algorithm: 'HS256',
                expiresIn: '1h'
            }
        )
        const safeUser = user.toSafeJSON();
        return {safeUser, token};
    }
    catch(error){
        console.log(error);
        throw new HttpError(401, 'Failed to create a token: Authentication failed');
    }
};
