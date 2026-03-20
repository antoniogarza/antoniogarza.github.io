# antoniogarza.github.io — Project Guide for Claude

## What this site is
Personal branding portfolio for **Antonio Garza**, Lead Full Stack Software Engineer (8+ years). The goal is a **premium, recruiter-facing site** that communicates seniority, taste, and technical depth at a glance. Think: the kind of personal site that makes a recruiter stop scrolling.

Future roadmap: add a `/portfolio` section with detailed case studies once the core brand is locked.

---

## Site architecture

**Hosting:** GitHub Pages — static HTML/CSS/JS only. No build step, no framework.

**Pages:**
- `index.html` — Main portfolio: hero, experience, projects, skills, blog preview, contact
- `blog.html` — Full blog listing (posts rendered by `scripts/blog.js` from `scripts/posts.js`)

**Scripts:**
- `scripts/posts.js` — Blog post data array. Updated automatically by n8n when a new post publishes.
- `scripts/blog.js` — Renders blog cards from `BLOG_POSTS`. Works on both `index.html` (preview) and `blog.html` (full grid).
- `scripts/panel.js` — AI chat panel + contact form + scheduling. Shared between both pages.

**Styles:**
- `css/styles.css` — Single global stylesheet, dark theme, design token–based.

**Design tokens (root CSS vars):**
- `--bg: #0a0a0a` · `--surface: #111111` · `--surface2: #181818` · `--border: #222222`
- `--text: #f0ede8` · `--muted: #6b6762`
- `--accent: #e8c547` (yellow — primary) · `--accent2: #4a9eff` (blue) · `--accent3: #ff6b4a` (red/error)

**Fonts:** Syne (display/headings) · DM Mono (body/code) · Instrument Serif (italic accents)

---

## AI Chat panel

The chat panel slides in from the right. It has three tabs: **AI Chat**, **Schedule**, **Contact**.

### How the chatbot works
The frontend calls **Groq's API** directly from the browser — no backend or proxy needed. Groq is CORS-enabled and their free tier is generous (open source models like Llama 3.3 70B). The API key lives in `panel.js`; since it's client-side and rate-limited, this is an accepted trade-off for a personal portfolio.

### Setup (2 minutes, free)
1. Go to [console.groq.com](https://console.groq.com) and create a free account
2. Click **API Keys → Create API Key**, copy it
3. Paste it into `GROQ_API_KEY` in `scripts/panel.js`
4. Push to GitHub — the chatbot is live

**Model in use:** `llama-3.3-70b-versatile` — high quality and free on Groq's free tier. For faster/cheaper responses swap to `llama-3.1-8b-instant`.

---

## Contact form
Uses **EmailJS** (free tier — 200 emails/month).
- Service ID: `service_hg2p6ta`
- Template ID: `template_ougtfee`
- Public key initialized in `panel.js`

---

## Blog automation
`scripts/posts.js` exports a `BLOG_POSTS` array. An **n8n workflow** automatically appends a new entry to this file after a post is published on Dev.to / Medium / LinkedIn, then re-deploys the site via GitHub Actions. The blog page and index preview update automatically.

---

## Antonio's background (for context when editing copy or AI prompts)

**Contact:** hello@antoniogarza.dev · McAllen, TX · Open to remote & relocation
**Languages:** English (native) · Spanish (native)
**Currently:** Actively job searching, available immediately

**Experience:**
- **Lead Full Stack Software Engineer @ ChaiOne.com** (Feb 2023 – Dec 2025): Promoted to Lead within 12 months. Technical direction across 5+ simultaneous enterprise engagements. Sole frontend architect for a national energy billing/payments platform serving millions of US customers (end client under NDA). Designed API contract layers, architected Azure IoT event pipelines (thousands of events/sec), CI/CD on Azure DevOps.
- **Senior Full Stack Software Engineer @ ChaiOne.com** (Feb 2022 – Jan 2023): Compliance tooling for regulated industries. Node.js/Express workflow engines with RBAC, passed security audits on first submission, zero regression rate.
- **Full Stack Engineer & Co-Founder @ IntegroPOS.com** (Jul 2018 – Feb 2022): SaaS POS from zero to 300+ active business locations. Led team of 6. Cross-platform desktop (Electron) + React Native mobile with shared codebase.

**Stack:** React · Next.js · TypeScript · React Native · Node.js · NestJS · Express · Ruby on Rails · Python · PHP · AWS · GCP · Azure · Docker · CI/CD · PostgreSQL · MongoDB · MySQL · MSSQL · IoT Pipelines · LLM APIs / RAG · LangChain

**Education:** Full Stack Developer Certification (ITESM) · FinTech Bootcamp (Northwestern University, 2022–2023)

**Currently exploring:** AI Engineering — LLM APIs, RAG Pipelines, LangChain, Agentic Systems

---

## Roadmap / future work
- [ ] Portfolio section (`/portfolio` or `#portfolio` on index) — detailed case studies with visuals
- [ ] AI-driven meeting booking — chatbot collects details and books via n8n + Google Calendar (future)
- [ ] More blog posts (automate via n8n)
- [ ] Dark/light mode toggle
- [ ] Add testimonials / recommendations section
- [ ] Improve mobile panel UX
