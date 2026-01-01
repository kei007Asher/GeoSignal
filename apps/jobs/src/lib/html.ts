interface HTMLContent {
  title: string;
  content: string;
}

export async function fetchHTML(url: string): Promise<HTMLContent> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTML fetch failed: ${response.status}`);
  }

  const html = await response.text();

  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch?.[1]?.trim() || 'Untitled';

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch?.[1] || html;

  content = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 10000);

  return { title, content };
}
