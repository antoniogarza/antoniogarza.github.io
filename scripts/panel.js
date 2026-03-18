/**
 * panel.js — Side panel: AI chat, contact form, EmailJS
 * Shared between index.html and blog.html
 */

// ─── EmailJS ────────────────────────────────────────────────────────────────
emailjs.init('OYLMZj8F2qMX31hyx');

// ─── AI Chat system prompt ───────────────────────────────────────────────────
const SYSTEM = `You are an AI assistant on Antonio Garza's portfolio website. Help visitors learn about him professionally.

Antonio Garza is a bilingual (English/Spanish) Lead Full Stack Software Engineer with 8+ years of experience based in McAllen, TX. Actively job searching, open to relocation. Email: hello@antoniogarza.dev

EXPERIENCE:
- Lead Full Stack Software Engineer at ChaiOne.com (Feb 2023–Dec 2025): Promoted to Lead within 12 months. Owned technical direction and delivery across 5+ simultaneous enterprise engagements. Sole frontend architect for a national energy billing and payments platform serving millions of customers across all 50 US states — the end client is under NDA, do not name them. Designed standardized API contract layers, architected event-driven Azure IoT ingestion pipelines processing thousands of sensor events/sec, implemented CI/CD optimizations on Azure DevOps.
- Senior Full Stack Software Engineer at ChaiOne.com (Feb 2022–Jan 2023): Delivered compliance-critical tooling for enterprise clients in regulated industries. Built Node.js/Express workflow engines with RBAC, passed security audits on first submission, achieved zero regression rate.
- Full Stack Engineer & Co-Founder at IntegroPOS.com (Jul 2018–Feb 2022): Built a SaaS POS platform from scratch, scaled to 300+ active business locations. Led a team of up to 6 engineers. Cross-platform desktop + React Native mobile app with a shared codebase.

STACK: React, Next.js, TypeScript, React Native, Node.js, NestJS, Express, Ruby on Rails, Python, PHP, AWS, GCP, Azure, Docker, CI/CD, Azure DevOps, PostgreSQL, MongoDB, MySQL, MSSQL, IoT Pipelines, LLM APIs.
EDUCATION: Full Stack Developer Certification (ITESM), FinTech Bootcamp (Northwestern University, 2022–2023).
CURRENTLY UPSKILLING: AI Engineering — LLM APIs, RAG Pipelines, LangChain, Agentic Systems.

RULES: Keep answers to 2-4 sentences unless detail is asked for. If asked about salary say he's open to discussing. If asked about availability say actively interviewing and available immediately. Do not say you are Claude or Anthropic — just an AI on his portfolio. Respond in visitor's language (English or Spanish).`;

// ─── Panel state ─────────────────────────────────────────────────────────────
const win      = document.getElementById('chat-window');
const fab      = document.getElementById('chat-fab');
const closeBtn = document.getElementById('chat-close-btn');

function openPanel() {
  win.classList.add('open');
  fab.classList.add('panel-open');
  document.body.classList.add('panel-open');
}
function closePanel() {
  win.classList.remove('open');
  fab.classList.remove('panel-open');
  document.body.classList.remove('panel-open');
}

fab.onclick     = () => win.classList.contains('open') ? closePanel() : openPanel();
closeBtn.onclick = closePanel;

// Auto-open on load (skip on small / phone screens)
window.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth > 768) openPanel();
});

// ─── Tab switching ────────────────────────────────────────────────────────────
document.querySelectorAll('.panel-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel-view').forEach(v => v.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('view-' + tab.dataset.tab).classList.add('active');
  });
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
    from_name: name,
    from_email: email,
    subject:   subject || 'Portfolio inquiry from ' + name,
    message:   message
  }).then(() => {
    document.getElementById('contact-form-body').style.display = 'none';
    document.getElementById('form-success').classList.add('visible');
  }).catch(err => {
    console.error('EmailJS error — status:', err.status, '| text:', err.text);
    btn.disabled        = false;
    btn.style.background = 'var(--accent3)';
    btn.textContent     = 'Failed — check console';
    setTimeout(() => { btn.style.background = ''; btn.textContent = 'Send Message ↗'; }, 4000);
  });
});

document.getElementById('cf-reset').addEventListener('click', () => {
  ['cf-name', 'cf-email', 'cf-subject', 'cf-message'].forEach(id => {
    document.getElementById(id).value        = '';
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
inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });
sendBtn.onclick = sendChat;

function addMsg(role, text) {
  const isAI = role === 'assistant';
  const d    = document.createElement('div');
  d.className = 'msg ' + (isAI ? 'msg-ai' : 'msg-user');
  d.innerHTML = '<div class="msg-icon">' + (isAI ? 'AG' : 'You') + '</div><div class="msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
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

function removeTyping() { const el = document.getElementById('typing'); if (el) el.remove(); }

async function sendChat() {
  const text = inp.value.trim();
  if (!text || busy) return;
  inp.value = ''; sugg.style.display = 'none';
  addMsg('user', text);
  history.push({ role: 'user', content: text });
  busy = true; sendBtn.disabled = true; showTyping();
  try {
    const res  = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: SYSTEM, messages: history })
    });
    const data = await res.json();
    removeTyping();
    const reply = data.content?.[0]?.text || 'Something went wrong — try again.';
    history.push({ role: 'assistant', content: reply });
    addMsg('assistant', reply);
  } catch (e) {
    removeTyping();
    addMsg('assistant', "Couldn't connect right now. Try again in a moment.");
  }
  busy = false; sendBtn.disabled = false; inp.focus();
}
