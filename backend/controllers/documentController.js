import Document from "../models/Document.js";

// Upload document as buffer to MongoDB
export const uploadDocument = async (req, res) => {
  try {
    const { employee } = req.body;
    const file = req.file;

    if (!employee || !file) {
      return res.status(400).json({ message: "Employee and file are required" });
    }

    const newDoc = await Document.create({
      employee,
      filename: file.originalname,
      contentType: file.mimetype,
      fileData: file.buffer,
    });

    res.status(201).json({ message: "Document uploaded", document: newDoc._id });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// Employee gets their own documents
export const getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ employee: req.user.userId }); // token se ID
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my documents", error: err.message });
  }
};


// Get all documents for HR
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().populate("employee", "name email");
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents", error: err.message });
  }
};

// Get documents for a specific employee
export const getEmployeeDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const docs = await Document.find({ employee: id });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee documents", error: err.message });
  }
};

// Stream/download a document (binary file)
export const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.set({
      "Content-Type": doc.contentType,
      "Content-Disposition": `inline; filename="${doc.filename}"`,
    });
    res.send(doc.fileData);
  } catch (err) {
    res.status(500).json({ message: "Error downloading document", error: err.message });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }, "_id name email department");
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees", error: err.message });
  }
};




