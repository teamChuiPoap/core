import { Schema, model } from "mongoose";
import { IUserWallet } from "../types/IUser";

const UserWalletSchema = new Schema<IUserWallet>({
    address: {
        type: String,
        required: true,
        unique: true
    },
    mnemonic: {
        type: String,
        required: true,
        unique: true
    },
    ownerID: {
        type: String,
        required: true,
        unique: true
    }
})

export const UserWallet = model('UserWallet', UserWalletSchema)