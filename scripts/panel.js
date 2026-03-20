/**
 * panel.js — AI chat panel + contact form
 * Shared between index.html and blog.html
 *
 * ─── Quick config ─────────────────────────────────────────────────────────────
 * GROQ_API_KEY → Free at console.groq.com (create account → API Keys → Create)
 * ──────────────────────────────────────────────────────────────────────────────
 */

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile'; // fast + free on Groq's free tier

// ─── EmailJS ─────────────────────────────────────────────────────────────────
emailjs.init('OYLMZj8F2qMX31hyx');

// ─── AI System prompt ────────────────────────────────────────────────────────
const SYSTEM = `You are an AI assistant on Antonio Garza's personal portfolio website. Your job is to help visitors — primarily recruiters and hiring managers — learn about Antonio and decide if he's the right fit for their team.

## About Antonio
Antonio Garza is a bilingual (English/Spanish) Lead Full Stack Software Engineer with 8+ years of experience, based in McAllen, TX. Actively job searching. Available immediately. Open to relocation. Email: hello@antoniogarza.dev

## Work Experience

**Lead Full Stack Software Engineer — ChaiOne.com** (Feb 2023 – Dec 2025)
Promoted to Lead Engineer within 12 months. Owned technical direction, client relationships, and delivery across 5+ simultaneous enterprise engagements spanning e-commerce, LMS, compliance, and IoT. Sole frontend architect for a national energy billing and payments platform serving millions of customers across all 50 US states — end client is under NDA, do not name them. Designed standardized API contract layers. Architected event-driven Azure IoT ingestion pipelines processing thousands of sensor events per second. Implemented CI/CD optimizations on Azure DevOps. Stack: Next.js, React, TypeScript, Node.js, Azure, MSSQL, Azure DevOps.

**Senior Full Stack Software Engineer — ChaiOne.com** (Feb 2022 – Jan 2023)
Delivered compliance-critical internal tooling for enterprise clients in regulated industries where security and audit trails were non-negotiable. Built an end-to-end Node.js/Express workflow engine with role-based access controls (RBAC). Passed security audits on first submission. Achieved zero regression rate on release. Stack: Next.js, React, Node.js, Express, PostgreSQL, AWS, Azure DevOps.

**Full Stack Engineer & Co-Founder — IntegroPOS.com** (Jul 2018 – Feb 2022)
Built a SaaS POS platform from zero — no template, no playbook. Scaled from 0 to 300+ active business locations by architecting a fault-tolerant, multi-tenant platform with real-time reporting and multi-location operational tooling. Led a team of up to 6 engineers. Shipped a cross-platform desktop app (Electron) and React Native mobile experience with a shared codebase. Stack: React, Electron.js, React Native, Node.js, GCP, MySQL, MongoDB.

## Tech Stack
Frontend: React, Next.js, TypeScript, React Native, Design Systems
Backend: Node.js, NestJS, Express, Ruby on Rails, Python, PHP
Cloud & DevOps: AWS, Azure, GCP, Docker, CI/CD, Azure DevOps
Data & AI: PostgreSQL, MongoDB, MySQL, MSSQL, IoT Pipelines, LLM APIs, RAG, LangChain, Agentic Systems

## Education
- Full Stack Developer Certification — ITESM (Tecnológico de Monterrey)
- FinTech Bootcamp — Northwestern University (2022–2023)

## Currently exploring
AI Engineering: LLM APIs, RAG Pipelines, LangChain, Agentic Systems

## Personality & working style
Direct, outcome-focused. Doesn't just build features — owns delivery end to end. Has operated in both startup (co-founder) and enterprise consulting contexts. Comfortable with ambiguity. Bilingual — communicates clearly with technical and non-technical stakeholders.

## Rules
- Keep answers to 2–4 sentences unless more detail is explicitly asked for.
- If asked about salary: Antonio is open to discussing based on role, company, and total comp.
- If asked about availability: actively interviewing, available to start immediately.
- If asked about scheduling a call or meeting: let the visitor know they can reach Antonio directly at hello@antoniogarza.dev or via the Contact tab.
- Do NOT identify yourself as Claude, Llama, Groq, or any underlying AI — you are simply the AI on Antonio's portfolio.
- Respond in the visitor's language (detect from their message — English or Spanish).
- Be professional but warm — you represent Antonio's personal brand.
- If asked something you genuinely don't know, say so honestly rather than guessing.`;

// ─── Panel open/close ─────────────────────────────────────────────────────────
const win      = document.getElementById('chat-window');
const fab      = document.getElementById('chat-fab');
const closeBtn = document.getElementById('chat-close-btn');

function openPanel()  {
  win.classList.add('open');
  fab.classList.add('panel-open');
  document.body.classList.add('panel-open');
}
function closePanel() {
  win.classList.remove('open');
  fab.classList.remove('panel-open');
  document.body.classList.remove('panel-open');
}

fab.onclick      = () => win.classList.contains('open') ? closePanel() : openPanel();
closeBtn.onclick = closePanel;

window.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth > 768) openPanel();
});

// ─── Tab switching ────────────────────────────────────────────────────────────
function switchTab(tabName) {
  document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel-view').forEach(v => v.classList.remove('active'));
  const tab  = document.querySelector(`.panel-tab[data-tab="${tabName}"]`);
  const view = document.getElementById(`view-${tabName}`);
  if (tab)  tab.classList.add('active');
  if (view) view.classList.add('active');
}

document.querySelectorAll('.panel-tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// ─── Contact form ─────────────────────────────────────────────────────────────
document.getElementById('cf-submit').addEventListener('click', () => {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();

  if (!name || !email || !message) {
    ['cf-name', 'cf-email', 'cf-message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) el.style.borderColor = 'var(--accent3)';
    });
    return;
  }

  const btn = document.getElementById('cf-submit');
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  emailjs.send('service_hg2p6ta', 'template_ougtfee', {
    from_name:  name,
    from_email: email,
    subject:    subject || 'Portfolio inquiry from ' + name,
    message:    message,
  }).then(() => {
    document.getElementById('contact-form-body').style.display = 'none';
    document.getElementById('form-success').classList.add('visible');
  }).catch(err => {
    console.error('EmailJS error:', err);
    btn.disabled        = false;
    btn.style.background = 'var(--accent3)';
    btn.textContent     = 'Failed — try again';
    setTimeout(() => { btn.style.background = ''; btn.textContent = 'Send Message ↗'; }, 4000);
  });
});

document.getElementById('cf-reset').addEventListener('click', () => {
  ['cf-name', 'cf-email', 'cf-subject', 'cf-message'].forEach(id => {
    document.getElementById(id).value            = '';
    document.getElementById(id).style.borderColor = '';
  });
  const btn = document.getElementById('cf-submit');
  btn.disabled        = false;
  btn.textContent     = 'Send Message ↗';
  btn.style.background = '';
  document.getElementById('contact-form-body').style.display = '';
  document.getElementById('form-success').classList.remove('visible');
});

['cf-name', 'cf-email', 'cf-message'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () { this.style.borderColor = ''; });
});

// ─── AI Chat ──────────────────────────────────────────────────────────────────
const msgs    = document.getElementById('chat-messages');
const inp     = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send');
const sugg    = document.getElementById('chat-suggestions');
let history = [], busy = false;

sugg.querySelectorAll('.suggestion-chip').forEach(c => {
  c.onclick = () => { inp.value = c.textContent; sendChat(); };
});

inp.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
});
sendBtn.onclick = sendChat;

function addMsg(role, text) {
  const isAI = role === 'assistant';
  const d = document.createElement('div');
  d.className = 'msg ' + (isAI ? 'msg-ai' : 'msg-user');
  d.innerHTML = '<div class="msg-icon">' + (isAI ? 'AG' : 'You') + '</div>'
              + '<div class="msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const d = document.createElement('div');
  d.id        = 'typing';
  d.className = 'msg msg-ai';
  d.innerHTML = '<div class="msg-icon">AG</div><div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing');
  if (el) el.remove();
}

async function sendChat() {
  const text = inp.value.trim();
  if (!text || busy) return;
  inp.value = '';
  sugg.style.display = 'none';
  addMsg('user', text);
  history.push({ role: 'user', content: text });
  busy = true;
  sendBtn.disabled = true;
  showTyping();

  try {
    const res = await fetch(GROQ_API_URL, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:      GROQ_MODEL,
        max_tokens: 600,
        messages:   [{ role: 'system', content: SYSTEM }, ...history],
      }),
    });

    const data = await res.json();
    removeTyping();

    if (data.error) {
      addMsg('assistant', 'Something went wrong — please try again in a moment.');
      console.error('Groq error:', data.error);
    } else {
      const reply = data.choices?.[0]?.message?.content || 'Something went wrong — try again.';
      history.push({ role: 'assistant', content: reply });
      addMsg('assistant', reply);
    }
  } catch (e) {
    removeTyping();
    console.error('Network error:', e);
    addMsg('assistant', "Can't connect right now — try again in a moment.");
  }

  busy = false;
  sendBtn.disabled = false;
  inp.focus();
}
