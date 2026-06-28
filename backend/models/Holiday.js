import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  type: { type: String, default: "Public Holiday" }
}, { timestamps: true });

export default mongoose.model("Holiday", holidaySchema);
