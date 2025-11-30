import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    techStack: String,
    link: String,
    fileUrl: String // image or pdf
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
