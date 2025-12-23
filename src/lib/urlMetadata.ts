export async function fetchUrlTitle(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SecondBrainLite/1.0)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // 1. Try og:title
    // Matches <meta property="og:title" content="..."> or <meta content="..." property="og:title">
    const ogTitleMatch = html.match(
      /<meta\s+[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>|<meta\s+[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i
    );
    if (ogTitleMatch) {
      return ogTitleMatch[1] || ogTitleMatch[2] || null;
    }

    // 2. Try <title>
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].trim() || null;
    }

    return null;
  } catch (error) {
    // Ignore errors (timeout, network, etc) for MVP
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
