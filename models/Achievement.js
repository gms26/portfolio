import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    type: String, // Achievement / Certificate / Award
    date: Date,
    fileUrl: String // image or pdf
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", AchievementSchema);
