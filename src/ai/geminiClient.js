// Gemini integration: retry with exponential backoff, strict JSON parsing.
//
// FIX: the original interpolated a literal `{API_KEY}` into the URL, so every
// request 400'd and silently fell back to offline mode. The key is now actually
// substituted (and URL-encoded).

import { GEMINI_MODEL, AI_MAX_RETRIES, AI_BASE_DELAY_MS } from '../state/constants.js';

const SYSTEM_PROMPT = `
You are generating story branches for 'Silicon Valley Simulator'.
Setting: San Francisco Bay Area startup ecosystem.
Format rules: return ONLY a valid, raw JSON object matching the requested schema. No Markdown wrappers.
`;

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    text: { type: 'STRING' },
    money_change: { type: 'INTEGER' },
    time_passed_minutes: { type: 'INTEGER' },
    journal_summary: { type: 'STRING' },
    emotional_state: { type: 'STRING' },
    is_game_over: { type: 'BOOLEAN' },
    game_over_reason: { type: 'STRING' },
    aesthetic_tags: { type: 'ARRAY', items: { type: 'STRING' } },
    choices: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { text: { type: 'STRING' }, scene_key: { type: 'STRING' } },
        required: ['text', 'scene_key'],
      },
    },
  },
  required: [
    'text', 'money_change', 'time_passed_minutes', 'journal_summary',
    'emotional_state', 'is_game_over', 'game_over_reason', 'aesthetic_tags', 'choices',
  ],
};

function cleanAndParseJSON(text) {
  if (!text) throw new Error('No response text received from the AI engine.');
  let clean = text.trim();
  // Strip ```json fences if present.
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return JSON.parse(clean.trim());
}

// Normalize the AI's snake_case payload into our camelCase scene shape.
function normalize(raw) {
  return {
    text: raw.text,
    moneyChange: raw.money_change || 0,
    timePassedMinutes: raw.time_passed_minutes || 0,
    journalSummary: raw.journal_summary,
    emotion: raw.emotional_state,
    isGameOver: !!raw.is_game_over,
    gameOverReason: raw.game_over_reason,
    aestheticTags: raw.aesthetic_tags || ['transit'],
    choices: (raw.choices || []).map((c) => ({ text: c.text, next: c.scene_key })),
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function runAITransition(apiKey, prompt) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;

  let delay = AI_BASE_DELAY_MS;
  for (let attempt = 0; attempt < AI_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { responseMimeType: 'application/json', responseSchema: RESPONSE_SCHEMA },
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        const reason = data.candidates?.[0]?.finishReason;
        throw new Error(
          reason === 'SAFETY'
            ? 'Response blocked by safety filters. Try a different choice.'
            : 'Empty response from Gemini. Please try again.'
        );
      }
      return normalize(cleanAndParseJSON(rawText));
    } catch (error) {
      if (attempt === AI_MAX_RETRIES - 1) throw error;
      await sleep(delay);
      delay *= 2;
    }
  }
}
