// geminiService.ts
// Always talk to your backend (`/api/get-fix`), never directly to Gemini API.
// The backend securely holds the API key.

export async function getBugFixSuggestion(
  buggyCode: string,
  bugDescription: string
): Promise<string> {
  // Base API endpoint
  // Use relative path in extension/webapp if same origin, otherwise fallback to full Cloud Run URL
  const API_BASE =
    typeof window !== "undefined" && window.location.origin.includes("bugsquasher.online")
      ? window.location.origin
      : "https://bugsquasher.online";

  const API_ENDPOINT = `${API_BASE}/api/get-fix`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ buggyCode, bugDescription }),
    });

    if (!response.ok) {
      let errorMsg = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMsg += `. ${errorData.error}`;
        }
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();

    if (data.fix) {
      return data.fix;
    } else if (data.suggestion) {
      // fallback in case backend responds with "suggestion"
      return data.suggestion;
    } else {
      throw new Error("The server did not return a valid suggestion.");
    }
  } catch (error) {
    console.error("Error fetching bug fix from server:", error);
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Could not connect to the Bug Squasher AI server. Please check your internet connection and the server URL."
        );
      }
      throw new Error(`Failed to get suggestion: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
}
