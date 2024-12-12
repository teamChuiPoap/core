import { Schema, model } from "mongoose";

const DoctorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  assignedPatients: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  role: {
    type: String,
    enum: ['doctor', 'admin'],
    default: 'doctor'
  }
}, {
  timestamps: true
});

export const Doctor = model("Doctor", DoctorSchema);