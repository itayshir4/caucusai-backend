import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.API_KEY}`
    );

    const data = await response.json();

    console.log("AVAILABLE MODELS:", JSON.stringify(data, null, 2));

    return res.json(data);

  } catch (error) {
    console.error("ERROR CALLING LIST MODELS:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));