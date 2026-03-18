/**
 * posts.js — Blog post data
 *
 * This is the file n8n updates automatically when a new post is published.
 * Each object in BLOG_POSTS represents one published article.
 *
 * Fields:
 *   title    {string}  — Post title
 *   date     {string}  — ISO date string e.g. "2026-03-18"
 *   excerpt  {string}  — Short description (1-2 sentences)
 *   tags     {array}   — Tech tags e.g. ["React", "TypeScript"]
 *   url      {string}  — Full URL to the published post
 *   platform {string}  — "devto" | "medium" | "linkedin" | "personal"
 *
 * n8n automation: append a new object to this array after publishing,
 * then re-deploy the site. The blog page and index preview update automatically.
 */

const BLOG_POSTS = [
  // Example — n8n will replace/append entries below this line:
  // {
  //   title: "Building an IoT Data Pipeline on Azure",
  //   date: "2026-03-18",
  //   excerpt: "How I architected an event-driven ingestion pipeline processing thousands of IoT sensor events per second for enterprise operations teams.",
  //   tags: ["Azure", "IoT", "Node.js", "Event Hubs"],
  //   url: "https://dev.to/antoniogarza/building-an-iot-data-pipeline-on-azure",
  //   platform: "devto"
  // }
];
