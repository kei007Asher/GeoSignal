import type { Env } from '../index';

interface PolishInput {
  title: string;
  summary: string;
  facts: string[];
}

interface PolishOutput {
  summary: string;
}

export function isLLMEnabled(env: Env): boolean {
  return env.LLM_MODE === 'on_demand' && !!env.OPENAI_API_KEY;
}

export async function polishText(
  input: PolishInput,
  env: Env
): Promise<PolishOutput> {
  if (!isLLMEnabled(env)) {
    return { summary: input.summary };
  }

  const model = env.OPENAI_MODEL || 'gpt-4o-mini';

  const systemPrompt = `あなたは文章整形アシスタントです。
重要なルール:
1. 新しい事実や根拠URLを追加しない
2. 入力された情報のみを整形する
3. 推測は「推測:」で始める
4. 簡潔で読みやすい日本語にする`;

  const userPrompt = `以下の情報を整形してください:
タイトル: ${input.title}
要約: ${input.summary}
事実: ${input.facts.join(', ')}

JSON形式で返してください: { "summary": "..." }`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0]?.message?.content || '{}';

  try {
    return JSON.parse(content);
  } catch {
    return { summary: input.summary };
  }
}
