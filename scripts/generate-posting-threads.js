const path = require("path");
const {
  buildPostingThreads,
  readJson,
  validatePostingThreads,
  writeJson,
} = require("./posting-thread-core");

const calendarPath = path.join(process.cwd(), "calendar_data.json");
const outputPath = path.join(process.cwd(), "posting_threads.json");

const calendarData = readJson(calendarPath);
const postingArticles = buildPostingThreads(calendarData);
const errors = validatePostingThreads(postingArticles);

if (errors.length) {
  console.error("Posting article validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

writeJson(outputPath, postingArticles);
console.log(`Generated ${postingArticles.length} long-form posting articles at ${outputPath}`);
