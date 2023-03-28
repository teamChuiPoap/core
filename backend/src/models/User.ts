import { Schema, model } from "mongoose";
import { IUser } from "../types/IUser";


const UserSchema  = new Schema <IUser>({
    name: {
        type: String,
        required: true
    },
    id_number: {
        type: String,
        required:true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String
    }

})

export const User = model('User', UserSchema)