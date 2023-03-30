import { Schema, model } from "mongoose";
import { IChama } from "../types/IChama";


const ChamaSchema = new Schema <IChama> ({
    name: {
        type: String,
        required: true
    },
    members: [
         String
    ],    
    wallet_id: {
        type: String
    }
}) 

export const Chama = model('Chama',ChamaSchema)