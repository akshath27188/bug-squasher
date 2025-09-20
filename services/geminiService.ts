
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBugFixSuggestion(
  buggyCode: string,
  bugDescription: string
): Promise<string> {
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
        temperature: 0.2, // Lower temperature for more deterministic, code-focused output
        topP: 0.9,
        topK: 40,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get suggestion from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
}
