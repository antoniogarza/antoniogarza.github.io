/**
 * chat-proxy — Cloudflare Worker
 *
 * Proxies requests from antoniogarza.github.io to the Anthropic API,
 * keeping the API key secret on the server side.
 *
 * ─── Deploy steps ─────────────────────────────────────────────────────────────
 * 1. Go to https://workers.cloudflare.com → Create Worker → paste this file
 * 2. Add your API key as a secret:
 *    Dashboard → Worker → Settings → Variables → Add Secret
 *    Name: ANTHROPIC_API_KEY  Value: sk-ant-...
 * 3. Note your worker URL (e.g. https://chat-proxy.yourname.workers.dev)
 * 4. Paste that URL into WORKER_URL in scripts/panel.js
 * ──────────────────────────────────────────────────────────────────────────────
 */

const ALLOWED_ORIGIN = 'https://antoniogarza.github.io';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // ── Preflight ──────────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ── Only allow POST ────────────────────────────────────────────────────
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    // ── Basic origin check (optional extra safety) ─────────────────────────
    const origin = request.headers.get('Origin') || '';
    if (origin && origin !== ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      const body = await request.json();

      // Forward to Anthropic
      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method:  'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      const data = await upstream.json();

      return new Response(JSON.stringify(data), {
        status:  upstream.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status:  500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
  },
};
