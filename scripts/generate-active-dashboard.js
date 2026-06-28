const fs = require("fs");
const path = require("path");

const posts = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "posting_threads.json"), "utf8")
);
const prompts = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "image_prompts.json"), "utf8")
);

const promptByDay = new Map(prompts.map((prompt) => [prompt.day, prompt]));

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dateLabel(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${value}T00:00:00+05:30`));
}

const cards = posts
  .map((post) => {
    const prompt = promptByDay.get(post.day);
    const image = post.imageUrl
      ? `<img src="${esc(post.imageUrl)}" alt="${esc(post.title)} image">`
      : `<div class="empty-image">Image pending</div>`;

    return `<article class="card">
      <div class="media">${image}</div>
      <div class="body">
        <p class="meta">Day ${post.day} · ${esc(dateLabel(post.date))} · ${esc(post.project)} · 18:00 IST</p>
        <h2>${esc(post.title)}</h2>
        <p>${esc(post.text.split("\n\n")[0])}</p>
        <details>
          <summary>Copy-ready post</summary>
          <pre>${esc(post.text)}</pre>
        </details>
        <details>
          <summary>Image prompt</summary>
          <pre>${esc(prompt ? prompt.prompt : post.imagePrompt)}</pre>
        </details>
      </div>
    </article>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Active X Posting Calendar</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #101214;
      --panel: #191d22;
      --line: #2c333a;
      --text: #f4f1e8;
      --muted: #aeb7bd;
      --accent: #71d6b2;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.5;
    }
    header {
      padding: 32px clamp(16px, 4vw, 48px) 20px;
      border-bottom: 1px solid var(--line);
    }
    h1 {
      margin: 0 0 8px;
      font-size: clamp(28px, 4vw, 46px);
      letter-spacing: 0;
    }
    header p, .meta {
      margin: 0;
      color: var(--muted);
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 24px clamp(16px, 4vw, 48px) 48px;
    }
    .card {
      display: grid;
      grid-template-columns: minmax(240px, 38%) 1fr;
      gap: 20px;
      padding: 18px 0;
      border-bottom: 1px solid var(--line);
    }
    .media {
      aspect-ratio: 5 / 2;
      background: var(--panel);
      border: 1px solid var(--line);
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .empty-image {
      height: 100%;
      display: grid;
      place-items: center;
      color: var(--muted);
    }
    h2 {
      margin: 6px 0 8px;
      font-size: 22px;
      letter-spacing: 0;
    }
    details {
      margin-top: 10px;
      border: 1px solid var(--line);
      background: var(--panel);
    }
    summary {
      cursor: pointer;
      padding: 10px 12px;
      color: var(--accent);
    }
    pre {
      margin: 0;
      padding: 12px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      color: var(--text);
      border-top: 1px solid var(--line);
    }
    @media (max-width: 760px) {
      .card { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <h1>Active X Posting Calendar</h1>
    <p>${posts.length} active posts · ${esc(dateLabel(posts[0].date))} to ${esc(dateLabel(posts.at(-1).date))} · Charge removed from active publishing</p>
  </header>
  <main>${cards}</main>
</body>
</html>
`;

for (const file of [
  "index.html",
  "fdv_ops_dashboard.html",
  "depin_creator_ops_dashboard.html",
  "FDV_OPS_30_Day_X_Content_Calendar.html",
  "depin_creator_ops_dashboard.html",
]) {
  fs.writeFileSync(path.join(process.cwd(), file), html, "utf8");
}

fs.writeFileSync(
  path.join(process.cwd(), "depin_30_day_calendar.md"),
  [
    "# Active X Posting Calendar",
    "",
    `Active posts: ${posts.length}`,
    `Date range: ${posts[0].date} to ${posts.at(-1).date}`,
    "Charge has been removed from the active publishing calendar.",
    "",
    ...posts.map((post) => `${post.day}. ${post.date} - ${post.project} - ${post.title}`),
    "",
  ].join("\n"),
  "utf8"
);

fs.writeFileSync(
  path.join(process.cwd(), "app.js"),
  `window.POSTING_THREADS = ${JSON.stringify(posts, null, 2)};\n`,
  "utf8"
);

console.log(`Generated active dashboard for ${posts.length} posts.`);
