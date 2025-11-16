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
OPENAI_API_KEY=sk-...           # optional, falls back to deterministic copy if missing
CLOUDINARY_CLOUD_NAME=changemedia
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_UPLOAD_FOLDER=changemedia/photography # optional override per request body
```

> Need a lighter stack? Leave the Cloudinary variables unset to keep using external image URLs.

### Content model quickstart
- All public copy + imagery comes from `content/site.json`. Edit via the CMS JSON editor or directly in Git.
- Photography commissions now live in `content/photography.json` with automatic versioning under `content/photography-history/`.
- Historic saves live under `content/history/` (auto-created). Use `/api/content/revisions` to inspect/restore marketing copy.
- Client deliverables + feedback live in `content/projects.json`. Each project has an `accessCode` for secure sharing.

### Photography CMS API

| Route | Method | Description |
| --- | --- | --- |
| `/api/photography` | GET | Returns the parsed photography content schema used by `/photography`. |
| `/api/photography` | PUT | Persist updates (requires `CMS_ADMIN_TOKEN` via `Authorization: Bearer ...`). Optional body keys: `data`, `note`. |
| `/api/photography/revisions` | GET | List recent revisions (admin only). Supports `?limit=50`. |
| `/api/photography/revisions` | POST | Restore a revision by filename. |
| `/api/media/signature` | POST | Generates a Cloudinary signature/timestamp for direct uploads. Send `{ folder?, publicId?, eager? }`. |

`content/photography.json` powers the hero, portfolio bento grid, service tiers, CTA, and SEO for the `/photography` page. Each portfolio item accepts either a straight `src` URL or a `publicId` that the Cloudinary helper will transform (`c_fill,q_auto,f_auto` by default) when `media.delivery` is set to `cloudinary`.

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
