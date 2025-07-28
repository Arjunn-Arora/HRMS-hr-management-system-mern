import multer from "multer";

// Use memory storage to keep file in memory (not on disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
