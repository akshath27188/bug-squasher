// This service now communicates with your backend server, which securely handles the Gemini API key.
// It no longer requires the user to input their own API key.

export async function getBugFixSuggestion(
  buggyCode: string,
  bugDescription: string
): Promise<string> {

  // IMPORTANT: Replace this with your actual deployed server URL (e.g., your Cloud Run URL)
  const API_ENDPOINT = 'https://bugsquasher.online/api/get-fix';

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ buggyCode, bugDescription }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
      // Provide a more specific error message if available from the server
      throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorData.error || ''}`);
    }

    const data = await response.json();
    
    if (data.fix) {
      return data.fix;
    } else {
      throw new Error("The server did not return a valid suggestion.");
    }
  } catch (error) {
    console.error("Error fetching bug fix from server:", error);
    if (error instanceof Error) {
        // Make the error message more user-friendly
        if (error.message.includes('Failed to fetch')) {
             throw new Error("Could not connect to the Bug Squasher AI server. Please check your internet connection and the server URL.");
        }
        throw new Error(`Failed to get suggestion: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
}