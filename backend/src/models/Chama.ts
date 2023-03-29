import { Schema } from "mongoose";
import { IChama } from "../types/IChama";


const ChamaSchema = new Schema <IChama> ({
    name: {
        type: String,
        required: true
    },
    members: [],    
    wallet_id: {
        type: String
    }
}) 