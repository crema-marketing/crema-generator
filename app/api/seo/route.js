export const runtime = 'edge';

export async function POST(req) {
  const { context } = await req.json();

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
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: '너는 SEO 전문가야. 요청받은 콘텐츠에 가장 적합한 SEO 키워드를 추천해줘.',
      messages: [{
        role: 'user',
        content: `다음 콘텐츠 재료를 바탕으로 SEO 핵심 키워드 5~7개를 쉼표로 구분해서 추천해줘. 키워드만 한 줄로 출력해. 설명 없이.\n\n${context}`
      }],
    }),
  });

  const data = await res.json();
  const text = (data.content || []).map(b => b.text || '').join('').trim();
  return new Response(JSON.stringify({ keywords: text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
