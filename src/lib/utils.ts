import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    // 1. Check for empty arrays or length mismatch
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
        // console.warn("cosineSimilarity: Invalid input vectors (empty or length mismatch)");
        return 0;
    }

    let dotProduct = 0;
    let sumSqA = 0;
    let sumSqB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        sumSqA += vecA[i] * vecA[i];
        sumSqB += vecB[i] * vecB[i];
    }

    // 2. Check for zero magnitude
    if (sumSqA === 0 || sumSqB === 0) {
        return 0;
    }

    const magnitudeA = Math.sqrt(sumSqA);
    const magnitudeB = Math.sqrt(sumSqB);

    const similarity = dotProduct / (magnitudeA * magnitudeB);

    // 3. Clamp output to [-1, 1] and handle NaN
    if (isNaN(similarity)) return 0;
    if (similarity > 1.0) return 1.0;
    if (similarity < -1.0) return -1.0;

    return similarity;
}
