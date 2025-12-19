import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateEmbedding(text: string): Promise<number[]> {
    // Gemini uses a different embedding model
    try {
        const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await embeddingModel.embedContent(text);
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response (remove potential markdown code blocks)
    const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
        const parsed = JSON.parse(jsonStr);
        return {
            summary: parsed.summary || "No summary available",
            topics: parsed.topics || [],
            title: parsed.title || "Untitled",
        };
    } catch {
        // Fallback if JSON parsing fails
        return {
            summary: "Note processed",
            topics: ["general"],
            title: "Note",
        };
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    try {
        const parsed = JSON.parse(jsonStr);
        return parsed.explanation || "Related concepts.";
    } catch {
        return "Related concepts.";
    }
}
