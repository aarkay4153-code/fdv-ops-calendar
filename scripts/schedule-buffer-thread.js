#!/usr/bin/env node
const {
  defaultTargetDate,
  loadEnvFile,
  parseArgs,
  readJson,
  scheduleBufferThread,
} = require("./posting-thread-core");

function printHelp() {
  console.log(`Schedule the next long X post through Buffer.

Usage:
  node scripts/schedule-buffer-thread.js [--dry-run] [--date YYYY-MM-DD]
  node scripts/schedule-buffer-thread.js --day 1 --schedule-date YYYY-MM-DD

Options:
  --dry-run          Validate and print the Buffer payload without posting.
  --date YYYY-MM-DD Schedule the long post for a specific calendar date.
  --day N            Select an article by day number instead of calendar date.
  --schedule-date    Schedule the selected day on this YYYY-MM-DD date.
  --file PATH       Read a custom posting_threads.json file.

Environment for live scheduling:
  BUFFER_API_KEY    Buffer API bearer token.
  BUFFER_CHANNEL_ID Buffer channel/profile ID for the connected X account.

Default target:
  Tomorrow in Asia/Kolkata, scheduled for 18:00 IST.
`);
}

async function main() {
  loadEnvFile();

  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const posts = readJson(args.file);
  const date = args.date || defaultTargetDate();
  const result = await scheduleBufferThread({
    posts,
    date,
    day: args.day,
    scheduleDate: args.scheduleDate,
    dryRun: args.dryRun,
  });

  if (result.status === "skipped") {
    console.log(result.message);
    return;
  }

  if (result.status === "dry-run") {
    console.log(
      JSON.stringify(
        {
          status: result.status,
          day: result.post.day,
          date: result.date,
          originalDate: result.originalDate,
          dueAt: result.dueAt,
          title: result.post.title,
          format: result.post.format,
          sections: result.post.sections.length,
          characterCount: result.post.text.length,
          containsRemovedHashtags: result.post.text.includes(
            "#DePIN #PhysicalAI #MachineEconomy"
          ),
          containsNfa: /not financial advice/i.test(result.post.text),
          bufferInput: result.input,
        },
        null,
        2
      )
    );
    return;
  }

  console.log(
    `Scheduled Day ${result.post.day} long post for ${result.date} at 18:00 IST. Buffer post ID: ${result.bufferPost.id}`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
