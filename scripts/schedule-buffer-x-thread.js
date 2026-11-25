#!/usr/bin/env node
const path = require("path");
const {
  loadEnvFile,
  parseArgs,
  readJson,
  scheduleBufferXThread,
} = require("./posting-thread-core");

async function main() {
  loadEnvFile();
  const args = parseArgs(process.argv.slice(2));
  const file = args.file || path.join(process.cwd(), "posting_thread_propbase_lend_2026-11-25.json");
  const thread = readJson(file);
  const result = await scheduleBufferXThread({ thread, dryRun: args.dryRun });

  if (result.status === "dry-run") {
    console.log(JSON.stringify({
      status: result.status,
      title: thread.internalTitle,
      dueAt: result.dueAt,
      itemCount: thread.threadItems.length,
      characterCounts: thread.threadItems.map((item) => item.text.length),
      bufferInput: result.input,
    }, null, 2));
    return;
  }

  console.log(`Scheduled connected X thread for ${thread.scheduleDate} at ${thread.scheduleTimeIst} IST. Buffer post ID: ${result.bufferPost.id}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
