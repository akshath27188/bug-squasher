
require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.static(__dirname)); // Serve static files

// Check for API Key and initialize Gemini
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// API endpoint to handle bug fix suggestions
app.post('/api/get-fix', async (req, res) => {
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

// Explicitly handle the /ads.txt route
app.get('/ads.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'ads.txt'));
});

// For any other route, serve the index.html file for the React SPA
// This should be the last route.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
