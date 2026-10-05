# Atire — project instructions

Streetwear storefront. Vite + Handlebars prototype in `src/`, being converted to a Shopify Online Store 2.0 theme in `theme/`.
Plan: `docs/shopify-conversion-plan.md` · Conventions/status: `docs/shopify-port.md`.

## Working log (mandatory)
Keep `log.md` (project root) up to date for **all** work on this project, especially the Shopify conversion.
- Add an entry **at the end of each unit of work** (a phase step, a feature, a refactor, a notable fix, a decision) — not at the end of the session only.
- Newest entry goes at the **top** of the "Entries" section, using the template in `log.md`.
- Each entry must say: what was done, files added/changed/removed, commands run and their result, decisions and why, verification performed, problems/blockers, and next steps.
- Record failures and reversals honestly. Never log something as done that wasn't verified.
- Update the phase status table in `log.md` and the checklist in `docs/shopify-port.md` when a phase changes state.
- Do not put secrets (tokens, passwords, store admin URLs with keys) in the log.

## Rules
- Never change the website's UI, styling, motion or behaviour as a side effect of the conversion; parity with the prototype is the bar.
- Do not commit or push unless the user asks. They review and commit themselves.
- Theme assets in `theme/assets/` are generated (`npm run build:theme`); edit `src/`, not the output.
- `theme/snippets/icon.liquid` is generated (`npm run theme:icons`).

## Environment
- Node lives in `~/.local/node/bin` (prefix PATH); no Homebrew/admin.
- Dev server: `.claude/launch.json` → `atire-dev` (port 5173). Append `?static` to a URL to disable motion for screenshots.
