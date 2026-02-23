import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { country, committee, topic, mode, resolutionText } = req.body;

  let prompt = "";

  // 🔹 LEADERSHIP MODE
  if (mode === "Leadership") {
    prompt = `
You are CaucusAI — an elite geopolitical strategy engine for Model UN.

Country: ${country}
Committee: ${committee}
Topic: ${topic}

Generate a HIGH-LEVEL political dominance plan including:

1. Opening Positioning Strategy
2. Bloc Building Blueprint (who to target and why)
3. Vote Math Strategy
4. If Contested: Counter-Moves
5. Leadership Securing Play

Be tactical. Be realistic. Focus on power dynamics.
`;
  }

  // 🔹 STRESS TEST MODE
  else if (mode === "Stress Test") {
    prompt = `
You are CaucusAI — a ruthless resolution analyst.

Country: ${country}
Committee: ${committee}
Topic: ${topic}

Analyze this resolution idea:

"${resolutionText}"

Generate:

1. Top Legal Weaknesses
2. Funding & Enforcement Vulnerabilities
3. Political Opposition Angles
4. Amendment Risks
5. How to Fortify It

Be critical. Assume hostile delegates are attacking.
`;
  }

  // 🔹 RESOLUTION AUDIT MODE
  else if (mode === "Resolution Audit") {
    prompt = `
You are CaucusAI — a strategic resolution auditor.

Country: ${country}
Committee: ${committee}
Topic: ${topic}

Resolution Text:
"${resolutionText}"

Provide:

1. Strength Score (1–10) with reasoning
2. Clause-by-Clause Weaknesses
3. Loopholes & Exploitable Gaps
4. Political Feasibility Analysis
5. Realism Check (Funding + Enforcement)
6. Strategic Improvements

Be detailed. Think like both sponsor and opposition.
`;
  }

  // 🔹 OPPOSITION SIMULATION MODE
  else if (mode === "Opposition Simulation") {
    prompt = `
You are CaucusAI — simulating an opposing bloc.

Country: ${country}
Committee: ${committee}
Topic: ${topic}

Resolution Summary:
"${resolutionText}"

Simulate a hostile opposition bloc and generate:

1. Top 5 Attacks Against This Resolution
2. Procedural Sabotage Options
3. Amendment Traps
4. Speech Attack Framing
5. Which Types of Countries Would Oppose and Why
6. How the Sponsor Can Defend Against These Attacks

Be strategic and realistic.
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