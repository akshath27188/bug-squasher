import { GoogleGenAI } from "@google/genai";

// This check is for the developer's benefit.
// In a real extension, the API key would need to be provided securely,
// possibly through a build-time environment variable replacement.
if (!process.env.API_KEY) {
  console.error("API_KEY environment variable is not set. The application will not be able to communicate with the Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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
        temperature: 0.2,
        topP: 0.9,
        topK: 40,
      }
    });

    const text = response.text;
    if (text) {
      return text;
    } else {
      throw new Error("The AI did not return a valid suggestion. The response may have been blocked due to safety settings or other issues.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Make the error message more user-friendly
        if (error.message.includes('API key not valid')) {
             throw new Error("The Gemini API key is invalid or missing. Please check your configuration.");
        }
        throw new Error(`Failed to get suggestion from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}
