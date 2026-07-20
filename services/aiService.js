/**
 * aiService.js
 *
 * Wrapper around an LLM API for the KaAni AI farming assistant.
 * Defaults to OpenAI-compatible endpoint. Swap AI_BASE_URL + model
 * if you use a different provider (Anthropic, Gemini, local Ollama, etc.)
 *
 * Required env vars:
 *   AI_API_KEY   — your LLM provider key
 *   AI_BASE_URL  — e.g. https://api.openai.com  (optional, defaults to OpenAI)
 *   AI_MODEL     — e.g. gpt-4o-mini             (optional, has default)
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com';
const MODEL    = process.env.AI_MODEL    || 'gpt-4o-mini';
const API_KEY  = process.env.AI_API_KEY  || '';

const SYSTEM_PROMPT = `
Ikaw si KaAni AI, isang friendly na agricultural assistant para sa mga magsasaka
at mangingisda sa Pilipinas. Sumasagot ka sa Tagalog (maaari ring English kung kailangan).

Ang iyong mga expertise:
- Pagtatanim ng palay, gulay, at prutas sa Pilipinas
- Pangingisda at aquaculture (bangus, tilapia, sugpo)
- Lokal na market prices at kooperatiba
- Panahon at kung kailan magtanim o mag-isda
- Pataba, pesticide, at organic farming
- Gobyerno programs para sa mga magsasaka (RCEF, PhilSCAT, ATI, etc.)

Sumagot nang maikli, malinaw, at praktikal. Gumamit ng simple na salita.
Kung hindi mo alam ang sagot, sabihing hindi ka sigurado at i-refer sa DA o extension office.
`.trim();

function postJson(url, body, headers) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(url);
        const payload = JSON.stringify(body);

        const req = https.request(
            {
                hostname: parsed.hostname,
                path: parsed.pathname + parsed.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload),
                    ...headers,
                },
            },
            res => {
                let raw = '';
                res.on('data', d => raw += d);
                res.on('end', () => {
                    try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
                    catch (e) { reject(e); }
                });
            }
        );
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

/**
 * chat({ message, history })
 *   message  — latest user message (string)
 *   history  — array of { role: 'user'|'assistant', content: string }
 *
 * Returns { reply: string }
 */
async function chat({ message, history = [] }) {
    if (!API_KEY) {
        /* Dev fallback when no key is set */
        return {
            reply: 'Naka-off ang AI assistant ngayon. Itakda ang AI_API_KEY sa .env file.',
        };
    }

    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.slice(-10),               // keep last 10 turns for context
        { role: 'user', content: message },
    ];

    const { status, data } = await postJson(
        `${BASE_URL}/v1/chat/completions`,
        { model: MODEL, messages, max_tokens: 512, temperature: 0.7 },
        { Authorization: `Bearer ${API_KEY}` }
    );

    if (status !== 200 || !data.choices?.[0]) {
        throw new Error(`AI API error ${status}: ${JSON.stringify(data)}`);
    }

    return { reply: data.choices[0].message.content.trim() };
}

export { chat };
