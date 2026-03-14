require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');
const { ALGORITHMS } = require('./public/algorithms.js');

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

// ─── g++ compile & run helper ───
function runCpp(source, timeout = 5000) {
  return new Promise((resolve) => {
    const id = `magnolia_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const tmpDir = os.tmpdir();
    const cppPath = path.join(tmpDir, `${id}.cpp`);
    const isWin = process.platform === 'win32';
    const outPath = path.join(tmpDir, isWin ? `${id}.exe` : id);

    fs.writeFileSync(cppPath, source);

    execFile('g++', ['-o', outPath, cppPath, '-std=c++17', '-O2'], { timeout: 10000 }, (compErr, _stdout, compStderr) => {
      // cleanup cpp
      try { fs.unlinkSync(cppPath); } catch {}

      if (compErr) {
        return resolve({ ok: false, stage: 'compile', error: compStderr || compErr.message });
      }

      execFile(outPath, [], { timeout }, (runErr, runStdout, runStderr) => {
        // cleanup binary
        try { fs.unlinkSync(outPath); } catch {}

        if (runErr) {
          if (runErr.killed) {
            return resolve({ ok: false, stage: 'runtime', error: '시간 초과 (TLE)' });
          }
          return resolve({ ok: false, stage: 'runtime', error: runStderr || runErr.message });
        }

        resolve({ ok: true, stdout: runStdout });
      });
    });
  });
}

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
  const { algorithm, algorithmId, code } = req.body;

  const algo = ALGORITHMS.find(a => a.id === algorithmId || a.name === algorithm);
  if (!algo || !algo.testCases || algo.testCases.length === 0) {
    return res.status(400).json({ error: '해당 알고리즘의 테스트 케이스가 없습니다.' });
  }

  const testResults = [];
  let compileError = null;

  for (const tc of algo.testCases) {
    const source = tc.harness.replace('%USER_CODE%', code);
    const result = await runCpp(source);

    if (!result.ok) {
      if (result.stage === 'compile') {
        compileError = result.error;
        break; // 컴파일 에러면 더 진행 불가
      }
      testResults.push({
        name: tc.name,
        passed: false,
        expected: tc.expected.trim(),
        actual: null,
        error: result.error
      });
    } else {
      const actual = result.stdout.trim();
      const expected = tc.expected.trim();
      testResults.push({
        name: tc.name,
        passed: actual === expected,
        expected,
        actual
      });
    }
  }

  const passed = testResults.filter(t => t.passed).length;
  const total = algo.testCases.length;
  const score = compileError ? 0 : Math.round((passed / total) * 100);

  res.json({
    correct: !compileError && passed === total,
    score,
    summary: compileError
      ? '컴파일 에러'
      : `${passed}/${total} 테스트 통과`,
    compileError,
    testResults
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Magnolia running at http://localhost:${PORT}`);
});
