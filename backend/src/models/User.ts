import { Schema, model } from "mongoose";
import { IUser } from "../types/IUser";

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  id_number: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },

  date_of_conception: {
    type: String,
    default: new Date(),
  },
  alert_messages: {
    type: [],
    default: [],
  },
  estimated_delivery: {
    type: String,
  },
  checkup_dates: { type: [], default: [] },
});

export const User = model("User", UserSchema);
