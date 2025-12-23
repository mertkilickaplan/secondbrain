import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Use gemini-2.0-flash model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Timeout helper to prevent infinite hanging
const timeout = (ms: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`AI Timeout after ${ms}ms`)), ms)
  );

export async function generateEmbedding(text: string): Promise<number[]> {
  // Gemini uses a different embedding model
  try {
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const result: any = await Promise.race([embeddingModel.embedContent(text), timeout(15000)]);
    return result.embedding.values;
  } catch (error) {
    console.warn("Embedding failed, using empty embedding:", error);
    // Return empty array - similarity will be calculated from topics instead
    return [];
  }
}

export async function analyzeNote(content: string) {
  const prompt = `You are an AI assistant for a Personal Knowledge Management system. 
Analyze the given note content and output a JSON object with:
- "summary": A concise 1-sentence summary of the note.
- "topics": An array of 3-5 relevant topic strings.
- "title": A short, descriptive title (if the note lacks one).

Note content:
${content}

Respond ONLY with valid JSON, no markdown code blocks or additional text.`;

  try {
    const result: any = await Promise.race([model.generateContent(prompt), timeout(15000)]);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response (remove potential markdown code blocks)
    const jsonStr = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(jsonStr);
    return {
      summary: parsed.summary || "No summary available",
      topics: parsed.topics || [],
      title: parsed.title || "Untitled",
    };
  } catch (e) {
    console.error("analyzeNote error:", e);
    throw e; // Let the caller handle it and show in UI
  }
}

export async function explainConnection(noteA: string, noteB: string): Promise<string> {
  const prompt = `Analyze the relationship between these two notes and explain their connection.
Output a JSON object with a single key "explanation".
The explanation must be a single sentence, under 140 characters, describing the most obvious link.

Note A:
${noteA}

Note B:
${noteB}

Respond ONLY with valid JSON, no markdown code blocks or additional text.`;

  try {
    const result: any = await Promise.race([model.generateContent(prompt), timeout(10000)]);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonStr = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(jsonStr);
    return parsed.explanation || "Related concepts.";
  } catch {
    return "Related concepts.";
  }
}
