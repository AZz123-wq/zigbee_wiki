# Repository Guidelines

## Project Structure & Module Organization

This repository is a local Zigbee Wiki Chat Workbench. Source code lives in `apps/`: `apps/server/` contains the Express + TypeScript API, PDF reader, LLM client, and JSON data store; `apps/frontend/` contains the React 18 + Vite + Tailwind UI. Knowledge assets are split between immutable raw sources in `knowledge/raw/` and maintained wiki pages in `knowledge/wiki/`. Indexing and health-check scripts live in `tools/scripts/`. Runtime JSON data and reports are under `runtime/data/` and `runtime/outputs/`.

## Build, Test, and Development Commands

- `npm run index`: rebuild wiki and raw source indexes.
- `npm run check`: run wiki health checks.
- `npm run reindex`: run index generation and health checks together.
- `npm run dev:server`: start the API server on port `3001`.
- `npm run dev:frontend`: start the Vite frontend on port `5173`.
- `cd apps/server && npm run build`: type-check and build the server.
- `cd apps/frontend && npm run build`: type-check and build the frontend.

There is no dedicated test script. Use the relevant build plus `npm run reindex` as minimum verification.

## Coding Style & Naming Conventions

Use TypeScript consistently. Follow existing formatting: two-space indentation, semicolons where already used, camelCase variables/functions, PascalCase React components, and kebab-case wiki filenames. Frontend API calls stay in `apps/frontend/src/lib/api.ts`; state belongs in `apps/frontend/src/lib/store.ts`. Server JSON persistence goes through `apps/server/src/dataStore.ts`.

Wiki pages require YAML frontmatter and lowercase, hyphenated paths such as `entities/cluster-on-off.md` or `summaries/2026-05-08-example.md`.

## Testing Guidelines

For wiki-only edits, run `npm run reindex`. For script changes, run `npm run reindex` and inspect `runtime/data/check-results.json`. For backend changes, run `cd apps/server && npm run build`; for frontend changes, run `cd apps/frontend && npm run build`. For API contract changes, build both.

## Commit & Pull Request Guidelines

No local Git history is available in this checkout. Use short, imperative commit messages with a scope when useful, for example `server: preserve PDF read limits` or `wiki: add on-off cluster summary`. Pull requests should describe the change, list verification commands, note data migrations, and include screenshots for UI updates.

## Security & Data Handling

Do not commit API keys or local secrets. The server reads `DEEPSEEK_API_KEY`, `ANTHROPIC_BASE_URL`, and `ANTHROPIC_MODEL` from the environment. Treat `knowledge/raw/specs/`, `knowledge/raw/test-specs/`, `knowledge/raw/presentations/`, and `knowledge/raw/other/` as read-only. Stage new source documents in `knowledge/raw/inbox/`. Do not rewrite user runtime data such as `conversations.json`, `messages.json`, `archives.json`, or `review-items.json` unless required. Preserve PDF safety limits in `apps/server/src/pdfSafeReader.ts`.
