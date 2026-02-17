import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
const API_KEY = process.env.NEWS_API_KEY;

app.get("/api/news", async (req, res) => {
  const { category = "technology", page = "1", pageSize = "6" } = req.query;

  if (!API_KEY) {
    res.status(500).json({
      status: "error",
      message: "NEWS_API_KEY is missing in .env",
    });
    return;
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json(data);
      return;
    }

    res.json(data);
  } catch {
    res.status(500).json({ status: "error", message: "Loading error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
