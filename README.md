## CHANGE Media Platform

This repo powers the CHANGE Media homepage, a token-protected CMS for the studio team, and client-facing workspaces where partners can review deliverables, leave timestamped feedback, and see AI-powered next steps.

### Stack
- **Next.js 15 / App Router** for the marketing site & dashboards
- **Tailwind v4** for styling
- **File-backed stores** (`content/site.json`, `content/projects.json`) validated with **Zod**
- **OpenAI** (optional) for AI insights (`OPENAI_API_KEY`)

## Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public landing page and `http://localhost:3000/cms` for the admin workspace.

### Required env vars
Create `.env.local` with:

```
CMS_ADMIN_TOKEN=super-secret-string
OPENAI_API_KEY=sk-... # optional, falls back to deterministic copy if missing
```

### Content model quickstart
- All public copy + imagery comes from `content/site.json`. Edit via the CMS JSON editor or directly in Git.
- Historic saves live under `content/history/` (auto-created). Use `/api/content/revisions` to inspect/restore.
- Client deliverables + feedback live in `content/projects.json`. Each project has an `accessCode` for secure sharing.

### CMS workflows (`/cms`)
1. Enter the admin token to unlock the dashboard (stored locally per browser).
2. Edit the landing page JSON, publish, and revalidate the home page instantly.
3. Spin up client workspaces, append deliverables, and trigger AI insight summaries for prep notes.

### Client portal (`/clients/[projectId]?key=<accessCode>`)
- Presents deliverables (with playable video embeds), checklists, AI notes, and a structured feedback form.
- Feedback posts back to `/api/projects/:id/feedback` and appears in the CMS immediately.

### Testing / linting

```bash
npm run lint
```

Add Playwright/Jest coverage as the CMS and client portal expand (see `docs/cms-architecture.md` for roadmap).
