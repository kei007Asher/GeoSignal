interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
}

export async function parseRSS(url: string): Promise<RSSItem[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status}`);
  }

  const text = await response.text();
  const items: RSSItem[] = [];

  const itemMatches = text.matchAll(/<item>([\s\S]*?)<\/item>/gi);
  for (const match of itemMatches) {
    const itemXml = match[1];

    const title = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)?.[1] || '';
    const link = itemXml.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/i)?.[1] || '';
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i)?.[1];
    const description = itemXml.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i)?.[1];

    if (title && link) {
      items.push({
        title: title.trim(),
        link: link.trim(),
        pubDate: pubDate?.trim(),
        description: description?.trim(),
      });
    }
  }

  return items;
}
