import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}

export async function analyzeNote(content: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are an AI assistant for a valid Personal Knowledge Management system. 
        Your task is to analyze the given note content and output a JSON object with:
        - "summary": A concise 1-sentence summary of the note.
        - "topics": An array of 3-5 relevant topic strings.
        - "title": A short, descriptive title (if the note lacks one).`
            },
            {
                role: "user",
                content: content,
            },
        ],
        response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return {
        summary: result.summary,
        topics: result.topics,
        title: result.title,
    };
}

export async function explainConnection(noteA: string, noteB: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a strict graph database helper. 
        Analyze the relationship between two notes based on their metadata.
        Output a JSON object with a single key "explanation".
        The explanation must be a single sentence, under 140 characters, describing the most obvious link.`
            },
            {
                role: "user",
                content: `Note A:\n${noteA}\n\nNote B:\n${noteB}`,
            },
        ],
        response_format: { type: "json_object" },
        max_tokens: 100, // Hard limit cost
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return result.explanation || "Related concepts.";
}
