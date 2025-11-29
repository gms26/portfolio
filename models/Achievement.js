import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  type: String,
  skills: [String],
  imageUrl: String,
  pdfUrl: String   // NEW
});

export default mongoose.model("Achievement", AchievementSchema);
