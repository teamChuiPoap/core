import { Schema, model } from "mongoose";

const ReportSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["patient", "alert", "checkup"],
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    dateRange: {
      startDate: Date,
      endDate: Date,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    data: Schema.Types.Mixed,
    fileUrl: String,
  },
  {
    timestamps: true,
  }
);

export const Report = model("Report", ReportSchema);
