import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  fileData: { type: Buffer, required: true }, // <-- File saved as binary
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Document", documentSchema);
