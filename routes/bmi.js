import express from "express";

const router = express.Router();

// 📏 BMI Calculation Route
router.post("/calculate", (req, res) => {
    const { weight, height } = req.body;

    if (!weight || !height) {
        return res.status(400).json({ error: "Please enter weight and height" });
    }

    const heightInMeters = height / 100; // Convert cm to meters
    const bmi = (weight / (heightInMeters ** 2)).toFixed(2);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal weight";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obesity";

    res.status(200).json({ bmi, category });
});

export default router;
