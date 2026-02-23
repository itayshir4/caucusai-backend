import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { country, committee, topic, mode } = req.body;

  let prompt = `
You are CaucusAI — an elite MUN strategic advisor.

You specialize in competitive committee strategy, bloc formation, and leadership positioning.

Country: ${country}
Committee: ${committee}
Topic: ${topic}
Mode: ${mode}

Your response must be tactical, realistic, and written like a competitive delegate preparing to win.

FORMAT YOUR RESPONSE CLEARLY USING HEADINGS.

---

1️⃣ OPENING STRATEGY
- How should this country frame the issue?
- What tone should they use?
- What key alliances should they hint at?
- What positioning differentiates them from rivals?

2️⃣ BLOC BUILDING PLAN
- Which types of countries should they approach first?
- What shared interests can be leveraged?
- What concessions are safe to offer?
- What red lines must be protected?

3️⃣ IF CONTESTED PLAN
- How to respond if another delegate challenges their leadership?
- How to undermine rival blocs diplomatically?
- Tactical maneuvers during moderated/unmoderated caucus.

4️⃣ LEADERSHIP SECURING MOVE
- Specific action to secure authorship or sponsorship.
- How to become indispensable to the room.
- Psychological leverage points.

IMPORTANT:
- Be specific, not generic.
- Do not repeat the prompt.
- Write in confident, strategic tone.
- Avoid filler.
`;

  // Add Stress Test mode extension
  if (mode === "Stress Test") {
    prompt += `

5️⃣ CLAUSE STRESS TEST
- Identify weaknesses in this country's likely draft clauses.
- How opponents would attack them.
- Defensive counters.
- Amendments to strengthen proposals.
`;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({
        error: "No valid response returned from Gemini",
        details: data
      });
    }

    res.json({
      output: data.candidates[0].content.parts[0].text
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));