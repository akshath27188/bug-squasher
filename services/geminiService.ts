
export async function getBugFixSuggestion(
  buggyCode: string,
  bugDescription: string
): Promise<string> {
  try {
    const response = await fetch('/api/get-fix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ buggyCode, bugDescription }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'The server returned an error.');
    }

    const data = await response.json();
    return data.fix;

  } catch (error) {
    console.error("Error fetching bug fix suggestion:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get suggestion from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
}
