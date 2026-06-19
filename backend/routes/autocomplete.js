import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/autocomplete", async (req, res) => {
  const inputText = req.body.text || req.body.prompt || req.body.input || "";

  if (!inputText.trim()) {
    return res.status(400).json({
      success: false,
      msg: "Text is required for autocomplete.",
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 50,
      messages: [
        {
          role: "system",
          content:
            "You are an autocomplete assistant for a notes app. Complete the user's text naturally and concisely. Support both English and Roman Urdu. If the user writes in Roman Urdu, continue in Roman Urdu. If the user writes in English, continue in English. Return only the next autocomplete text without explanations, labels, or markdown.",
        },
        {
          role: "user",
          content: inputText,
        },
      ],
    });

    const suggestion = completion?.choices?.[0]?.message?.content?.trim() || "";

    return res.status(200).json({
      success: true,
      suggestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Failed to generate autocomplete suggestion.",
      error: error.message,
    });
  }
});

export default router;