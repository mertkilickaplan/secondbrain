/**
 * AI Function Tests
 * Tests for Google Gemini AI integration with mocked API
 */

import { analyzeNote, generateEmbedding, explainConnection } from "../ai";

// Create shared mock functions
const mockGenerateContent = jest.fn();
const mockEmbedContent = jest.fn();

// Mock the Google Generative AI module
jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockImplementation(() => ({
        generateContent: mockGenerateContent,
        embedContent: mockEmbedContent,
      })),
    })),
  };
});

describe("AI Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("analyzeNote", () => {
    it("should successfully analyze note content", async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              summary: "Test summary",
              topics: ["topic1", "topic2"],
              title: "Test Title",
            }),
        },
      });

      const result = await analyzeNote("Test note content");

      expect(result).toEqual({
        summary: "Test summary",
        topics: ["topic1", "topic2"],
        title: "Test Title",
      });
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it("should parse JSON with markdown code blocks", async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => '```json\n{"summary":"Test","topics":[],"title":"Title"}\n```',
        },
      });

      const result = await analyzeNote("Content");

      expect(result.summary).toBe("Test");
      expect(result.title).toBe("Title");
    });

    it("should handle timeout", async () => {
      mockGenerateContent.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 20000))
      );

      await expect(analyzeNote("Content")).rejects.toThrow("AI Timeout");
    }, 20000);

    it("should throw error on invalid JSON", async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => "Invalid JSON",
        },
      });

      await expect(analyzeNote("Content")).rejects.toThrow();
    });

    it("should handle API errors", async () => {
      mockGenerateContent.mockRejectedValue(new Error("API Error"));

      await expect(analyzeNote("Content")).rejects.toThrow("API Error");
    });
  });

  describe("generateEmbedding", () => {
    it("should successfully generate embedding", async () => {
      mockEmbedContent.mockResolvedValue({
        embedding: {
          values: [0.1, 0.2, 0.3, 0.4, 0.5],
        },
      });

      const result = await generateEmbedding("Test text");

      expect(result).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
      expect(mockEmbedContent).toHaveBeenCalledWith("Test text");
    });

    it("should return empty array on error (fallback)", async () => {
      mockEmbedContent.mockRejectedValue(new Error("Embedding failed"));

      const result = await generateEmbedding("Test text");

      expect(result).toEqual([]);
    });

    it("should handle timeout with fallback", async () => {
      mockEmbedContent.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 20000))
      );

      const result = await generateEmbedding("Test text");

      expect(result).toEqual([]);
    }, 20000);
  });

  describe("explainConnection", () => {
    it("should successfully explain connection", async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () =>
            JSON.stringify({
              explanation: "Both notes discuss AI technology",
            }),
        },
      });

      const result = await explainConnection("Note A content", "Note B content");

      expect(result).toBe("Both notes discuss AI technology");
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it("should parse JSON with markdown code blocks", async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => '```json\n{"explanation":"Related topics"}\n```',
        },
      });

      const result = await explainConnection("A", "B");

      expect(result).toBe("Related topics");
    });

    it("should return fallback message on error", async () => {
      mockGenerateContent.mockRejectedValue(new Error("API Error"));

      const result = await explainConnection("A", "B");

      expect(result).toBe("Related concepts.");
    });

    it("should return fallback on timeout", async () => {
      mockGenerateContent.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 15000))
      );

      const result = await explainConnection("A", "B");

      expect(result).toBe("Related concepts.");
    }, 16000);

    it("should return fallback on invalid JSON", async () => {
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => "Not JSON",
        },
      });

      const result = await explainConnection("A", "B");

      expect(result).toBe("Related concepts.");
    });
  });
});
