import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import mailRoutes from "./routes/mail.js";
import bmiRoutes from "./routes/bmi.js";
import weatherRoutes from "./routes/weather.js";
import crudRoutes from "./routes/crud.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // Измени порт, если фронт работает на другом

app.use(express.static(path.join(__dirname, "pages")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "login.html"));
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.get("/qrcode", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "qrcode.html"));
});

app.get("/mail", (req, res)=>{
    res.sendFile(path.join(__dirname, "pages", "mail.html"));
});
app.use("/mail", mailRoutes);

app.use("/bmi", bmiRoutes);

app.get("/bmi", (req, res) => {
    res.sendFile(path.join(path.resolve(), "pages", "bmi.html"));
});

app.use("/weather", weatherRoutes);

app.get("/weather", (req, res) => {
    res.sendFile(path.join(path.resolve(), "pages", "weather.html"));
});

app.use("/crud", crudRoutes);

app.get("/crud", (req, res) => {
    res.sendFile(path.join(path.resolve(), "pages", "crud.html"));
});

app.use("/admin", adminRoutes);

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "admin.html"));
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
