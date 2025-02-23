import express from "express";
import QRCode from "qrcode";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const router = express.Router();

router.post("/generate", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== "string" || text.length > 1000) {
            return res.status(400).json({ error: "Invalid input: Text must be a string with a maximum length of 1000 characters." });
        }

        const qrDataUrl = await QRCode.toDataURL(text);
        res.status(200).json({ qrCode: qrDataUrl });
    } catch (error) {
        console.error("❌ QR Code generation error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;