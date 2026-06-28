const path = require("path");
const { readJson } = require("./posting-thread-core");

const posts = readJson(path.join(process.cwd(), "posting_threads.json"));
const prompts = readJson(path.join(process.cwd(), "image_prompts.json"));

const promptByDay = new Map(prompts.map((prompt) => [prompt.day, prompt]));
const errors = [];

function hasRemovedChargeProject(value) {
  return /@charge_xyz/i.test(JSON.stringify(value));
}

if (posts.length !== prompts.length) {
  errors.push(`Post/prompt count mismatch: ${posts.length} posts, ${prompts.length} image prompts`);
}

for (const post of posts) {
  const prompt = promptByDay.get(post.day);
  if (!prompt) errors.push(`Day ${post.day}: missing image prompt`);
  if (post.project === "Charge" || hasRemovedChargeProject(post)) {
    errors.push(`Day ${post.day}: Charge content should not be in the active posting set`);
  }
  if (post.format !== "long_x_post") errors.push(`Day ${post.day}: not long_x_post`);
  if (!post.text || post.text.length < 1000) errors.push(`Day ${post.day}: text is too short`);
  if (post.text && post.text.length > 25000) errors.push(`Day ${post.day}: text exceeds X long-post limit`);
  if (post.text && post.text.includes("#DePIN #PhysicalAI #MachineEconomy")) {
    errors.push(`Day ${post.day}: removed hashtag block still present`);
  }
  if (post.text && /not financial advice/i.test(post.text)) {
    errors.push(`Day ${post.day}: NFA text still present`);
  }
  if (!Array.isArray(post.sections) || post.sections.length !== 5) {
    errors.push(`Day ${post.day}: expected 5 sections`);
  }
  if (post.sections && post.sections[4] && post.sections[4].heading !== "Conclusion") {
    errors.push(`Day ${post.day}: final section is not Conclusion`);
  }
  if (prompt) {
    if (prompt.project === "Charge" || hasRemovedChargeProject(prompt)) {
      errors.push(`Day ${post.day}: Charge image prompt should not be in the active posting set`);
    }
    if (!/no text/i.test(prompt.prompt)) errors.push(`Day ${post.day}: prompt missing no-text constraint`);
    if (!/pixel art/i.test(prompt.prompt)) errors.push(`Day ${post.day}: prompt missing pixel-art style`);
    if (!prompt.publicUrl || !prompt.localPath) {
      errors.push(`Day ${post.day}: prompt missing image paths`);
    }
  }
}

if (errors.length) {
  console.error("Posting asset audit failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const lengths = posts.map((post) => post.text.length);
console.log(
  JSON.stringify(
    {
      posts: posts.length,
      prompts: prompts.length,
      firstDate: posts[0].date,
      lastDate: posts.at(-1).date,
      minChars: Math.min(...lengths),
      maxChars: Math.max(...lengths),
      status: "ok",
    },
    null,
    2
  )
);
