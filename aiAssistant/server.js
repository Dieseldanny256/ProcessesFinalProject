import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/chat", async (req, res) => {
    const { userText } = req.body;

    if (!userText || userText.trim() === "") {
        return res.status(400).json({ error: "Question could not be left empty!" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userText }],
            }),
        });

        const data = await response.json();

        // Print response from API
        console.log("OpenAI API Response:", JSON.stringify(data, null, 2));

        // This step is to check if there is no choice
        if (!data.choices || data.choices.length === 0) {
            console.error("OpenAI API Response Error:", data);
            return res.status(500).json({
                error: "Incorrect return format",
                details: data,
            });
        }

        res.json({ botResponse: data.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            error: "Error connecting with API. Please try again!",
            details: error.message,
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
