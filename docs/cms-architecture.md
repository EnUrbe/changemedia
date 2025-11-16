# Client-Facing Content Management System

## Objectives
- Let non-technical partners update landing content (hero, metrics, services, showcase, testimonials, FAQ, contact details) without touching code.
- Keep read performance as fast as the current static build.
- Provide light validation, version history, and safe rollback in case of bad edits.
- Require minimal setup: no external SaaS CMS, keep everything within the existing Next.js repo.

## High-Level Architecture
| Layer | Responsibility | Implementation Notes |
| --- | --- | --- |
| **Data store** | Persist the full landing-page JSON snapshot plus historical revisions. | File-based store at `content/site.json` with append-only history under `content/history/*.json`. Stored alongside the repo so deployments always have the latest published content. |
| **Validation** | Ensure user input matches the layout contract before persisting. | Zod schema (`src/lib/contentSchema.ts`) that mirrors every section of the landing page. Used by both API routes and the CMS UI for instant feedback. |
| **Service helpers** | Abstract reading/writing content files, handle revision metadata, inject timestamps, redact secrets. | Utility in `src/lib/contentStore.ts` with `getContent()`, `saveContent()`, `listRevisions()`, `restoreRevision()`. Uses Node `fs/promises` and keeps operations server-only. |
| **API layer** | Secure endpoints for reading/updating content. | App Router endpoints under `src/app/api/content/route.ts` (GET returns current snapshot, PUT updates). Requires bearer token header matching `CMS_ADMIN_TOKEN`. Optional `src/app/api/content/revisions/route.ts` for listing/restoring history. |
| **Admin UI** | Human-friendly dashboard for edits, previews, and publishing. | Protected route at `src/app/cms/page.tsx`. Auth via single-use token stored in cookie/localStorage. UI built with React server components + client-side forms using hooks. |
| **Public site** | Consume the same JSON so marketing pages stay in sync. | `ChangeMediaLanding` fetches data from `lib/contentStore` (server component) or via `getContent()` during build. No hard-coded strings remain except design copy. |

### Request Flow
1. CMS user visits `/cms`, provides admin token, and loads current content via `GET /api/content`.
2. User edits structured forms (hero, case studies, etc.); UI validates via shared Zod schema.
3. User hits "Publish" → `PUT /api/content` sends new payload plus metadata.
4. API validates payload, writes to `content/site.json`, appends revision file, and returns success.
5. Public landing page automatically reflects new content (server components re-read JSON on request; ISR/SSR supported).

## Content Schema
Below is the contract used by both API and UI. The actual implementation will live in `src/lib/contentSchema.ts`.

```ts
export type Pill = string;
export type Tag = string;

export interface HeroContent {
  eyebrow: string;
  locationPill: string;
  title: string;
  subtitle: string;
  ctas: { label: string; href: string; variant: "primary" | "secondary" | "ghost" }[];
  metrics: { label: string; value: string }[];
}

export interface MarqueeContent {
  phrases: string[]; // micro-docs, reels, etc.
}

export interface LogoCloudContent {
  heading: string;
  logos: { src: string; alt: string }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl?: string;
  tags: Tag[];
}

export interface ServiceCard {
  id: string;
  title: string;
  price: {
    monthly?: string;
    annual?: string;
    onetime?: string;
  };
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactContent {
  email: string;
  city: string;
  instagram: { handle: string; url: string };
  youtube: { label: string; url: string };
  calendlyUrl: string;
}

export interface SiteContent {
  hero: HeroContent;
  marquee: { phrases: string[] };
  logoCloud: LogoCloudContent;
  featuredCases: CaseStudy[];
  galleryCases: CaseStudy[];
  features: { title: string; description: string }[];
  studio: { ethos: string; bullets: string[]; quote: string; attribution: string };
  services: ServiceCard[];
  includedKit: string;
  testimonials: Testimonial[];
  faqs: FaqItem[];
  contact: ContactContent;
  seo: { title: string; description: string; ogImage: string };
}
```

### Validation Enhancements
- All URLs validated via regex to avoid accidental relative paths.
- Image fields require HTTPS sources to keep next/image happy.
- Video URLs limited to mp4 or streaming providers we support.
- `featuredCases` limited to 4 items; `galleryCases` limited to 12 for layout reasons.

## Projects + Client Work Schema

`content/projects.json` keeps every deliverable workspace snapshot:

```ts
export interface ClientProject {
  id: string;
  clientName: string;
  projectTitle: string;
  status: "planning" | "in-production" | "in-review" | "approved" | "delivered";
  summary: string;
  dueDate: string;
  pointOfContact: { name: string; email: string };
  accessCode: string;
  deliverables: Deliverable[];
  feedback: FeedbackNote[];
  checklist: string[];
  aiNotes?: string;
}

export interface Deliverable {
  id: string;
  type: "video" | "gallery" | "document" | "audio" | "link";
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  status: "ready" | "needs-review" | "in-progress" | "archived";
}

export interface FeedbackNote {
  id: string;
  author: string;
  role: string;
  message: string;
  timestamp: string;
}
```

## API Contract
| Method | Route | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/content` | Returns `{ data: SiteContent, revision: string }`. Cached with `revalidate: 60`. | Optional (public read) |
| `PUT` | `/api/content` | Accepts `{ data: SiteContent, note?: string }`. Validates, saves, records revision metadata (timestamp, editor). | Requires `Authorization: Bearer <CMS_ADMIN_TOKEN>` |
| `GET` | `/api/content/revisions` | Lists last N revisions for rollbacks. | Auth required |
| `POST` | `/api/content/revisions` | Body `{ revisionId: string }` restores prior snapshot. | Auth required |
| `GET` | `/api/projects` | Lists projects (sanitized for public calls, full data for admins). | Optional |
| `POST` | `/api/projects` | Creates or replaces a project. | Auth required |
| `GET` | `/api/projects/:projectId` | Returns a project. Requires matching `?key=` unless admin. | Conditional |
| `PUT` | `/api/projects/:projectId` | Updates a project payload. | Auth required |
| `POST` | `/api/projects/:projectId/feedback` | Appends client feedback to a project. | Access code required |
| `POST` | `/api/ai/insights` | Generates AI summaries / next steps for a project. | Auth required |

### Auth Strategy
- Configure `.env` with `CMS_ADMIN_TOKEN=<strong-random-string>`.
- The CMS UI stores the token in `localStorage` (per device) and sends it as a `Bearer` header for each admin API call.
- Client workspaces stay protected with a per-project `accessCode` that must be supplied as a `?key=` query parameter when viewing and submitting feedback.

## Admin UI Flow
1. **Login screen**: minimal form that stores the admin token in localStorage and injects it into Bearer headers.
2. **Dashboard layout**: left nav anchors (Hero, Work, Services, Testimonials, FAQ, Contact, SEO).
3. **Section editors**: structured forms with repeatable fields (list add/remove). Live preview via `<ChangeMediaLanding>` bound to local state.
4. **Validation feedback**: form-level errors from shared Zod schema. Dirty state indicator.
5. **Publishing controls**: JSON editor + preview, Publish (PUT `/api/content`) with history log + rollback endpoints.
6. **Client delivery**: Project creation, deliverable uploads, AI summary trigger, and feedback monitoring all live in the CMS workspace.

## Client Workspace Flow
1. Producers share `/clients/[projectId]?key=<accessCode>`.
2. Clients view ready/needs-review assets, see due dates and checklists, and read AI notes.
3. Feedback form posts to `/api/projects/:id/feedback` with the same key, instantly updating the project's JSON record.

### Portrait Experience Intake (new)
- Luxury portrait reservations now live at `/photography/portrait`, pulling pricing + portfolio data from `content/photography.json`.
- Clients complete a combined booking form + style quiz, upload inspiration files (stored under `public/uploads/portrait`), and receive an auto-generated tracking code.
- Submissions persist in `content/portrait-experience.json` via `POST /api/photography/portrait-experience` (no auth required).
- Photographers/Admins can call `PATCH /api/photography/portrait-experience` with a bearer token to update status or push timeline notes/attachments; updates stream back to clients in real time when they refresh with their tracking code.

## AI Automation
- `generateAiInsights()` calls OpenAI (when `OPENAI_API_KEY` exists) for summaries + next steps; otherwise it falls back to deterministic messaging.
- `/api/ai/insights` secures the workflow and writes results back to the CMS dashboard.
- AI notes surface both in the admin panel and the client workspace for alignment on next actions.

## Deployment & Performance
- Public pages stay server-side; reading from JSON is synchronous and fast (<2ms).
- For ISR deployments (e.g., Vercel), writing to `content/site.json` via API ensures next request serves new data immediately (App Router caches can be revalidated by calling `unstable_cache` tag or `revalidatePath('/')`).
- History files provide disaster recovery even if repo is redeployed.

## Next Implementation Steps
1. Surface revision history + rollback controls directly inside the CMS dashboard.
2. Add optimistic UI + inline validation for specific sections (hero, services) instead of the raw JSON editor.
3. Expand the client portal with per-deliverable approvals and file downloads (ZIP + stills gallery view).
4. Wire automated Slack/email hooks when new feedback lands.
5. Add Jest/Playwright coverage for API routes, content store helpers, and the CMS happy paths.
