// ====================================================================================
// Bug Squasher AI backend server
// ====================================================================================

import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import cors from "cors";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// --- Global Middleware ---
app.use(cors({
  origin: "*", // for prod, restrict to "https://bugsquasher.online"
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

app.use(express.json()); // parse JSON bodies

// --- Check for API Key and init Gemini ---
if (!process.env.GOOGLE_API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// --- API Routes ---
app.post('/api/get-fix', async (req, res) => {
  console.log("Request received at /api/get-fix");
  const { buggyCode, bugDescription } = req.body;

  if (!buggyCode || !bugDescription) {
    return res.status(400).json({ error: 'buggyCode and bugDescription are required.' });
  }

  const prompt = `
You are an expert software engineer and world-class debugger.
A user has provided a piece of code with a bug. Your task is to analyze the buggy code and the description of the bug, then provide a corrected version of the code and a brief explanation of the fix.

**Buggy Code:**
\`\`\`
${buggyCode}
\`\`\`

**Bug Description:**
${bugDescription}

---

**Instructions for your response:**
1. First, provide the corrected and complete code block. Do not add any introductory text like "Here is the corrected code:" before it.
2. The code block should be enclosed in a single markdown code block (e.g., \`\`\`javascript ... \`\`\`).
3. After the code block, add a horizontal rule (\`---\`).
4. After the rule, add a section titled "### Explanation of the fix:"
5. Under this heading, provide a clear, concise, and friendly explanation of what was wrong and how you fixed it. Use bullet points for clarity.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        topP: 0.9,
        topK: 40,
      }
    });

    const text = response.text;
    if (text) {
      res.json({ fix: text });
    } else {
      res.status(500).json({ error: "The AI did not return a valid suggestion. The response may have been blocked." });
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Failed to get suggestion from AI.' });
  }
});

// --- SEO / Special files ---
app.get('/ads.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'ads.txt'));
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bugsquasher.online/</loc>
    <lastmod>2024-05-21</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(sitemapContent);
});

// --- JS Extension Rewrite Middleware ---
app.use((req, res, next) => {
  const reqPath = req.path;
  if (path.extname(reqPath) || reqPath.startsWith('/api/')) {
    return next();
  }
  const filePath = path.join(__dirname, 'dist', reqPath + '.js');
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) return next();
    req.url += '.js';
    next();
  });
});

// --- Static frontend serving ---
app.use(express.static(path.join(__dirname, "dist")));

// --- SPA fallback (last) ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
