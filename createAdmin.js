import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const createAdmin = async () => {
    const email = "admin@example.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists");
            process.exit();
        }

        const admin = new User({
            email,
            password: hashedPassword,
            role: "admin"
        });

        await admin.save();
        console.log("✅ Admin user created successfully");
        process.exit();
    } catch (err) {
        console.error("❌ Error creating admin:", err);
        process.exit(1);
    }
};

createAdmin();