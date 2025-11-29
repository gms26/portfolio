import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tech: [String],
  imageUrl: String,
  pdfUrl: String,   // NEW
  github: String,
  live: String
});

export default mongoose.model("Project", ProjectSchema);
