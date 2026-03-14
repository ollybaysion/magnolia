require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const anthropic = new Anthropic();

const SYSTEM_PROMPT_GUIDE = `You are an expert competitive programming coach reviewing C++ algorithm implementations (No STL allowed).
The student is practicing implementing a specific algorithm from scratch.

Your role in GUIDE MODE:
- Analyze the current partial code and identify what's been implemented so far
- Point out any bugs or logical errors you see
- Suggest what the next step should be
- Keep feedback concise (3-5 bullet points max)
- Use Korean language for explanations
- Reference specific line numbers when pointing out issues
- Do NOT give the full solution - only guide

Format your response as a JSON object:
{
  "progress": 0-100 (estimated completion percentage),
  "status": "starting" | "in_progress" | "almost_done" | "complete",
  "feedback": ["bullet point 1", "bullet point 2", ...],
  "bugs": ["bug description 1", ...] or [],
  "hint": "next step hint (optional, short)"
}`;

const SYSTEM_PROMPT_VERIFY = `You are an expert competitive programming judge reviewing C++ algorithm implementations (No STL allowed).

Your role in VERIFY MODE:
- Thoroughly verify if the algorithm is correctly implemented
- Check edge cases, correctness, time complexity, space complexity
- Verify it matches the expected algorithm (not a different approach)
- Check that NO STL containers or algorithms are used (no vector, map, set, sort, queue, priority_queue, etc.)
- Basic I/O (printf, scanf, cout, cin) and cstring functions are allowed
- Use Korean language for explanations

Format your response as a JSON object:
{
  "correct": true | false,
  "score": 0-100,
  "summary": "Overall assessment in 1-2 sentences",
  "correctness_issues": ["issue 1", ...] or [],
  "stl_violations": ["violation 1", ...] or [],
  "complexity": { "time": "O(...)", "space": "O(...)" },
  "edge_cases": ["handled/missed edge case 1", ...],
  "suggestions": ["improvement 1", ...] or []
}`;

app.post('/api/guide', async (req, res) => {
  const { algorithm, code } = req.body;

  if (!code || code.trim().length < 5) {
    return res.json({
      progress: 0,
      status: 'starting',
      feedback: ['코드 작성을 시작하세요.'],
      bugs: [],
      hint: `${algorithm}의 기본 구조부터 작성해보세요.`
    });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT_GUIDE,
      messages: [{
        role: 'user',
        content: `Algorithm to implement: ${algorithm}\n\nCurrent code:\n\`\`\`cpp\n${code}\n\`\`\``
      }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      res.json({ progress: 0, status: 'in_progress', feedback: [text], bugs: [], hint: '' });
    }
  } catch (err) {
    console.error('Guide API error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/verify', async (req, res) => {
  const { algorithm, code } = req.body;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT_VERIFY,
      messages: [{
        role: 'user',
        content: `Algorithm to verify: ${algorithm}\n\nSubmitted code:\n\`\`\`cpp\n${code}\n\`\`\``
      }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      res.json({ correct: false, score: 0, summary: text, correctness_issues: [], stl_violations: [], complexity: {}, edge_cases: [], suggestions: [] });
    }
  } catch (err) {
    console.error('Verify API error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Magnolia running at http://localhost:${PORT}`);
});
