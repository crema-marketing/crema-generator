export const runtime = 'edge';

export async function POST(req) {
  const { messages, max_tokens = 3500 } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens,
      system: '너는 크리마 콘텐츠 에디터야. 주어진 원고를 채널 특성에 맞게 변환해. 내용의 핵심은 그대로 유지하면서 형식과 문체만 조정해.',
      messages,
      stream: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: res.status });
  }

  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
