# Repository Guidelines

## Project Structure & Module Organization

This is a Bun/Turborepo monorepo. `apps/web` is the Next.js customer app; UI code lives in `apps/web/src/app`, `components`, `hooks`, `libs`, and `styles`. `apps/backend` contains the Convex backend. In `apps/backend/convex`, use `schema*` for data models, `web/*` for customer APIs, `meyoo/*` for admin APIs, `core/*` for shared logic, `shopify/*` and `meta/*` for integrations, and `jobs/*` or `engine/*` for background work. Shared code lives in `packages/types`, `packages/time`, `packages/ui`, and config packages.

## Build, Test, and Development Commands

- `bun install`: install workspace dependencies.
- `bun run dev`: run all development tasks through Turbo.
- `bun run dev --filter=web`: start the Next.js app on port 3000.
- `bun run dev --filter=@repo/backend`: start Convex with `convex dev`.
- `bun run lint`: run ESLint.
- `bun run check-types`: run type checks.
- `bun run format`: format TS, TSX, and Markdown with Prettier.
- `bun run build`: run production builds through Turbo.

## Coding Style & Naming Conventions

Use strict TypeScript from `packages/typescript-config`. Prefer named exports and keep files grouped by domain. Do not add explicit return types unless required by the compiler or a public contract; keep types clean and minimal. Use camelCase filenames for utility modules and never edit `convex/_generated`. Run Prettier for broad formatting changes.

## UI & HeroUI Guidance

For UI changes, read `.agents/skills/heroui-react/SKILL.md` before implementation. Prefer existing HeroUI components, tokens, and Tailwind v4 styling in `apps/web/src/styles/globals.css` and `apps/web/src/styles/hero.ts`. Follow `CLAUDE.md`: do not add shadows or borders to cards and buttons unless an existing pattern requires it.

## Convex Rules

For Convex changes, read `convex_rules.md` first. Always add argument and return validators. Use `query`/`mutation`/`action` only for public APIs and internal registrations for private functions. Avoid full table scans: query with indexes, paginate or `take()` bounded results, and never use `.collect().length` for counts. Keep external I/O in actions or HTTP actions.

## Testing Guidelines

No dedicated test runner is configured. For every change, run `bun run lint` and `bun run check-types`. When adding tests, colocate them with `*.test.ts` or `*.spec.ts`, and add a workspace `test` script.

## Commit & Pull Request Guidelines

Recent commits use short imperative summaries. Keep commits focused, such as `Fix Shopify webhook processing`. PRs should include a description, affected area, linked issues, verification results, and screenshots for UI changes.

## Security & Configuration Tips

Do not commit secrets or local `.env*` files. Environment names are centralized in `turbo.json`; add new runtime variables there when they affect Turbo tasks. Treat platform credentials as sensitive, and prefer env helper modules over direct `process.env` reads.
