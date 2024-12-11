import { model, Schema } from "mongoose";

const alertSchema = new Schema({
  phoneNumber: {
    type: String,
  },
  msg: {
    type: String,
  },
});

export const Alert = model("Alert", alertSchema);
