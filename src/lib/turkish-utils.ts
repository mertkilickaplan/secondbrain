/**
 * Turkish Character Normalization Utilities
 * 
 * Handles Turkish-specific character normalization for better search compatibility.
 * Converts Turkish characters to their ASCII equivalents for consistent matching.
 */

/**
 * Normalize Turkish characters to ASCII equivalents
 * 
 * @param text - Text to normalize
 * @returns Normalized text with ASCII characters
 * 
 * @example
 * normalizeTurkish("Ekşi Sözlük") // "Eksi Sozluk"
 * normalizeTurkish("İstanbul") // "Istanbul"
 * normalizeTurkish("Çağrı") // "Cagri"
 */
export function normalizeTurkish(text: string): string {
    if (!text) return text;

    return text
        // Lowercase Turkish characters
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/İ/g, 'i')  // Turkish capital I with dot
        // Uppercase Turkish characters
        .replace(/Ş/g, 'S')
        .replace(/I/g, 'I')  // Keep regular I as is
        .replace(/Ğ/g, 'G')
        .replace(/Ü/g, 'U')
        .replace(/Ö/g, 'O')
        .replace(/Ç/g, 'C');
}

/**
 * Check if text contains Turkish characters
 * 
 * @param text - Text to check
 * @returns True if text contains Turkish-specific characters
 */
export function hasTurkishCharacters(text: string): boolean {
    return /[şığüöçŞİĞÜÖÇ]/.test(text);
}
