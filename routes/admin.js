import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Update user by ID
router.put("/users/:id", async (req, res) => {
    try {
        const { email, role } = req.body;
        const { id } = req.params;

        const updatedUser = await User.findByIdAndUpdate(id, { email, role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Delete user by ID
router.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

export default router;
