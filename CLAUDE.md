# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Magnolia is a C++ algorithm practice tool for competitive programming (No STL). Users select an algorithm, write C++ code in a Monaco editor, and get real-time AI-guided feedback plus automated verification via g++ compilation and test case execution.

The UI is in Korean. The app deploys to Railway via Docker.

## Commands

- **Run dev server:** `npm start` or `node server.js` (serves on port 3000)
- **No test framework or linter is configured.**
- Requires `ANTHROPIC_API_KEY` in `.env` for the guide API.
- Requires `g++` with C++17 support on the host for verification (`/api/verify`).

## Architecture

**Single Express server (`server.js`)** serving static files and two API endpoints:

- `POST /api/guide` — Sends user's code + algorithm name to Claude (Sonnet) for coaching feedback. Returns structured JSON (progress, feedback, bugs, hint). Responses are in Korean.
- `POST /api/verify` — Compiles user code with a test harness via g++, runs it, and compares stdout against expected output. No AI involved.

**Frontend (all in `public/`, no build step):**

- `index.html` — Single-page layout: sidebar (algorithm list), center (Monaco editor), right panel (AI feedback), plus verification and solution modals.
- `app.js` — All UI logic. Monaco editor setup, guide mode with 1.5s debounce, verify flow, timer, localStorage auto-save per algorithm (`magnolia_code_{id}`).
- `algorithms.js` — Algorithm registry. Shared between server and browser via `if (typeof module !== 'undefined') module.exports` pattern.
- `style.css` — Dark theme styles.

## Algorithm Registry (`public/algorithms.js`)

Each algorithm entry contains: `id`, `name`, `category`, `difficulty` (1-3), `description`, `skeleton` (starter code), `solution`, `keywords`, and `testCases`.

Each test case has a `harness` string with `%USER_CODE%` placeholder that gets replaced with user code before compilation. The harness includes `main()` and I/O to produce expected stdout.

When adding a new algorithm, add it to the `ALGORITHMS` array. Categories are auto-derived. The file is ~2400 lines.

## Verification Flow

User code is never executed directly. The server wraps it in a test harness (`tc.harness.replace('%USER_CODE%', code)`), writes to a temp file, compiles with `g++ -std=c++17 -O2`, runs the binary with a 5-second timeout, and compares stdout. Temp files are cleaned up after each run.
