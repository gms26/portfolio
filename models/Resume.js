import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    resumeUrl: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
