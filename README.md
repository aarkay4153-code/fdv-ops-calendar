# FDV OPS DePIN Article Calendar

Offline-ready DePIN + Physical AI X article dashboard built from the latest
uploaded content calendar.

## Files

- `index.html` - GitHub Pages entrypoint and full interactive dashboard.
- `depin_creator_ops_dashboard.html` - Standalone dashboard file.
- `fdv_ops_dashboard.html` - Same dashboard under the earlier local filename.
- `calendar_data.json` - Parsed articles and separate image prompts.
- `posting_threads.json` - Daily long-form X posts generated from the calendar.
- `build_uploaded_calendar.js` - Rebuilds the dashboard from the uploaded text.
- `scripts/generate-posting-threads.js` - Regenerates daily long-form posts.
- `scripts/schedule-buffer-thread.js` - Schedules one long post through Buffer.

## Posting System

- Date range: June 28, 2026 to July 24, 2026.
- Reminder time: 18:00 IST.
- Posting to X is automated through a Buffer-first rolling scheduler.
- Direct X API posting is intentionally left as a fallback because it can add
  billing and policy complexity.

The current automation plan is:

1. Connect the target Twitter/X account to Buffer.
2. Create a Buffer API key.
3. Put the Buffer values into local `.env.local` for local checks:
   ```env
   BUFFER_API_KEY=your_real_buffer_api_key
   BUFFER_CHANNEL_ID=your_real_buffer_x_channel_id
   ```
4. Confirm Buffer can see the account:
   ```bash
   npm run buffer:check
   ```
5. Dry-run the next long post:
   ```bash
   npm run schedule:dry-run
   ```
6. Schedule one live post locally:
   ```bash
   npm run schedule:live
   ```
7. Add these GitHub repository secrets for daily automation:
   - `BUFFER_API_KEY`
   - `BUFFER_CHANNEL_ID`
8. Run the `Daily X Long Post Scheduler` workflow manually once to seed the
   first scheduled post.
9. Let the workflow run daily at 18:10 IST. Each run schedules the next day's
   18:00 IST long post.

No Twitter/X password, browser session, or direct website automation is needed.
The only account-specific value this repo needs is the Buffer channel/profile ID
for the X account you connected inside Buffer.

Useful local commands:

```bash
npm run generate:posts
npm run buffer:check
npm run schedule:dry-run -- --date 2026-06-29
npm run schedule:live -- --date 2026-06-29
npm test
```

The workflow exits cleanly when no future calendar day exists, so the current
27-post batch will not backfill or loop forever.

Each supplied calendar day opens into:

- A complete copy-ready article.
- A separate copy-ready image prompt.
- Source links.
- A local posted/not-posted status.

Every image prompt requests an exact 5:2 aspect ratio, no text or logos, and
uses a pixel-art editorial style.

Charge has been removed from the active calendar. The remaining 27 posts now
start with NATIX Network and continue through peaq.
