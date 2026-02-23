import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { country, committee, topic, mode } = req.body;

  const prompt = `
You are CaucusAI.

Country: ${country}
Committee: ${committee}
Topic: ${topic}
Mode: ${mode}

Generate:
1. Opening Strategy
2. Bloc Building Plan
3. If Contested Plan
4. Leadership Securing Move
`;

  try {
 const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  }
);

    const data = await response.json();

console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

if (!data.candidates) {
  return res.status(500).json({ error: "No candidates returned", details: data });
}

res.json({
  output: data.candidates[0].content.parts[0].text
});

  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));