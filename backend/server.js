import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import authRoutes from "./routes/authRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import announcementRoutes from './routes/announcementRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import teamLeadRoutes from "./routes/teamLeadRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js"
import payrollRoutes from "./routes/payrollRoutes.js"
import documentRoutes from "./routes/documentRoutes.js";


const app = express();
connectDB();

app.use(cors({credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/teamlead", teamLeadRoutes);
app.use("/api/leaves", leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use("/api/documents", documentRoutes);

app.get('/', (req, res) => res.send("HRMS API Running..."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));