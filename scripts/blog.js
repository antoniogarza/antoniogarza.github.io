/**
 * blog.js — Blog rendering
 * Requires posts.js to be loaded first (defines BLOG_POSTS).
 * Used on both index.html (preview) and blog.html (full list).
 */

(function () {

  const PLATFORM_LABELS = { devto: 'Dev.to', medium: 'Medium', linkedin: 'LinkedIn', personal: 'Personal' };

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function buildCard(post) {
    const tags  = (post.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
    const label = PLATFORM_LABELS[post.platform] || post.platform;
    return `
      <a class="blog-card reveal" href="${post.url}" target="_blank" rel="noopener">
        <div class="blog-card-meta">
          <span class="blog-date">${formatDate(post.date)}</span>
          <span class="blog-platform ${post.platform}">${label}</span>
        </div>
        <div class="blog-title">${post.title}</div>
        <p class="blog-excerpt">${post.excerpt}</p>
        <div class="blog-footer">
          <div style="display:flex;flex-wrap:wrap;gap:6px">${tags}</div>
          <span class="blog-read">Read ↗</span>
        </div>
      </a>`;
  }

  function emptyState() {
    return `<div class="blog-empty">
      <div class="blog-empty-title">Posts coming soon</div>
      <div class="blog-empty-sub">Writing on React, AI Engineering, enterprise architecture &amp; more.</div>
    </div>`;
  }

  // ── Full blog grid (blog.html) ────────────────────────────────────────────
  const fullGrid = document.getElementById('blog-grid-full');
  if (fullGrid) {
    fullGrid.innerHTML = BLOG_POSTS.length
      ? BLOG_POSTS.map(buildCard).join('')
      : emptyState();
    reobserve(fullGrid);
  }

  // ── Index preview (index.html) — latest 3 posts ───────────────────────────
  const previewGrid = document.getElementById('blog-grid-preview');
  if (previewGrid) {
    const preview = BLOG_POSTS.slice(0, 3);
    previewGrid.innerHTML = preview.length
      ? preview.map(buildCard).join('')
      : emptyState();
    reobserve(previewGrid);
  }

  // Re-run IntersectionObserver on newly created .reveal elements
  function reobserve(container) {
    if (typeof ro !== 'undefined') {
      container.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    }
  }

})();
