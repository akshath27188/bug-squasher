// ====================================================================================
// Bug Squasher AI Backend (Cloud Run)
// Receives requests from extension/webapp, adds API key securely, calls Gemini API.
// ====================================================================================

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// --- Serve static frontend (for webapp) ---
app.use(express.static(path.join(__dirname, 'dist')));

// --- Gemini API handler ---
app.post('/api/get-fix', async (req, res) => {
  try {
    const { buggyCode, bugDescription } = req.body;

    if (!buggyCode) {
      return res.status(400).json({ error: 'Buggy code is required' });
    }

    // Initialize SDK (no apiKey here — it picks up GOOGLE_API_KEY from env)
    const ai = new GoogleGenAI();
    const model = ai.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    The user submitted buggy code:

    ${buggyCode}

    Bug description: ${bugDescription || '(none provided)'}

    Please analyze the code, explain the error if any, and suggest a corrected version.
    `;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                 "No suggestion returned from Gemini API.";

    res.json({ suggestion: text });

  } catch (err) {
    console.error("Error fetching suggestion:", err);
    res.status(500).json({
      error: "Failed to get suggestion from AI",
      details: err.message || err,
    });
  }
});

// --- Catch-all for SPA (for webapp UI) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Bug Squasher AI server running on port ${PORT}`);
});
