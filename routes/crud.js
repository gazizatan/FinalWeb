import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Define the Post schema
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    topic: { type: String, required: true }
});

// Create the Post model
const Post = mongoose.model("Post", PostSchema);

// Get all posts with pagination
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const posts = await Post.find().skip(skip).limit(limit);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении постов" });
    }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Пост не найден" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "Неверный формат ID" });
    }
});

// Get posts by topic
router.get("/topic", async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: "Параметр 'name' обязателен" });
        }

        const posts = await Post.find({ topic: name });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при поиске по теме" });
    }
});

// router.get("/search", async (req, res) => {
//     try {
//         const { query } = req.query;
//         if (!query) {
//             return res.status(400).json({ error: "Параметр 'query' обязателен" });
//         }
//
//         console.log("Search query:", query); // Log the query
//
//         // Perform the search
//         const posts = await Post.find({
//             $or: [
//                 { title: { $regex: query, $options: "i" } },
//                 { content: { $regex: query, $options: "i" } }
//             ]
//         });
//
//         console.log("Search results:", posts); // Log the results
//
//         res.json(posts);
//     } catch (error) {
//         console.error("Search error:", error); // Log the error
//         res.status(500).json({ error: "Ошибка при поиске постов", details: error.message });
//     }
// });

// Create a new post
router.post("/", async (req, res) => {
    try {
        const { title, content, topic } = req.body;

        if (!title || !content || !topic) {
            return res.status(400).json({ error: "Все поля (title, content, topic) обязательны" });
        }

        const newPost = new Post({ title, content, topic });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при создании поста" });
    }
});

// Update a post by ID
router.put("/:id", async (req, res) => {
    try {
        const { title, content, topic } = req.body;

        if (!title || !content || !topic) {
            return res.status(400).json({ error: "Все поля (title, content, topic) обязательны" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, topic },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Пост не найден" });
        }

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при обновлении поста" });
    }
});

// Delete a post by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({ error: "Пост не найден" });
        }

        res.json({ message: "Пост успешно удален" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при удалении поста" });
    }
});

export default router;