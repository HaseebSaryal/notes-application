import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/improve", async (req, res) => {
  const inputText = req.body.text || "";

  if (!inputText.trim()) {
    return res.status(400).json({
      success: false,
      msg: "Text is required for improvement.",
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "Improve the grammar and clarity of this text. User may write in Roman Urdu or English. Reply in same language as input. Do not change the meaning.",
        },
        {
          role: "user",
          content: inputText,
        },
      ],
    });

    const improvedText = completion?.choices?.[0]?.message?.content?.trim() || "";

    return res.status(200).json({
      success: true,
      improvedText,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to improve text.",
      error: error.message,
    });
  }
});

export default router;