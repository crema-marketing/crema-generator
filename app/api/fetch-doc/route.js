export const runtime = 'edge';

export async function POST(req) {
  const { url } = await req.json();
  if (!url) return Response.json({ error: 'URL required' }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CremaContentBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    // 불필요한 블록 제거 후 텍스트 추출
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#\d+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length > 4000) text = text.slice(0, 4000) + '...(이하 생략)';

    return Response.json({ content: text });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
