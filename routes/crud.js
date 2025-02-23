import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    topic: { type: String, required: true }
});

const Post = mongoose.model("Post", PostSchema);

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

// 📌 GET посты по теме
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

router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Параметр 'query' обязателен" });
        }

        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } }
            ]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при поиске постов" });
    }
});

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