const fs = require('fs');
const path = require('path');

const sources = [
  'C:/Users/Rohit/.codex/attachments/1a523426-32a0-47b0-b2be-e505a9feb21e/pasted-text.txt',
  'C:/Users/Rohit/.codex/attachments/7bcc54cc-4dcf-480f-be1c-e200b2a2245b/pasted-text.txt'
];
const outDir = path.resolve(__dirname, '..');
const raw = sources.map((p) => fs.readFileSync(p, 'utf8').replace(/\r/g, '')).join('\n');
const starts = [...raw.matchAll(/(?=^Article \d+: )/gm)].map((m) => m.index);
const blocks = starts.map((start, i) => raw.slice(start, starts[i + 1]).trim()).filter(Boolean);
if (blocks.length !== 10) throw new Error(`Expected 10 articles, found ${blocks.length}`);

const hooks = [
  ['Carbon markets do not begin with credits. They begin with land that can be measured.', 'Across northern Mexico, @dimitratech is showing how ranching data can become restoration evidence.', 'The hard part is making every hectare count.'],
  ['A coffee shipment can be high quality and still lose its market.', 'In Tanzania, @dimitratech is connecting smallholder records to the proof European buyers now demand.', 'That changes what market access looks like.'],
  ['Smart farming is easy to describe from a stage. It is harder to make work across real farms.', '@dimitratech brought that infrastructure conversation to the FAO Global Conference in Rome.', 'The useful question is what survives after the applause.'],
  ['For smallholder supply chains, paperwork is becoming a market-access problem.', '@dimitratech is building the farm-level evidence needed when European buyers ask where every crop came from.', 'Compliance now starts much closer to the soil.'],
  ['Forest protection becomes durable when conservation can be measured and paid for.', 'In Roraima, @dimitratech is helping connect producers, carbon evidence, and deforestation-free agriculture.', 'The strongest climate model may be the one local producers can use.'],
  ['Agritech becomes a business when field data can meet capital and buyers in the same conversation.', '@dimitratech’s European leadership meetings point to the commercial layer behind the deployments.', 'The next phase is about repeatable relationships.'],
  ['Regenerative farming takes seasons to prove, but farmers need useful guidance today.', 'Connected Cacao gives @dimitratech a way to link soil health, farm decisions, and verifiable outcomes in Brazil.', 'Better practice needs better records.'],
  ['A farmer cannot manage a season with hindsight.', '@dimitratech turns satellite, weather, and field history into forecasts that can shape decisions before losses arrive.', 'Prediction is most valuable when it reaches the field in time.'],
  ['Agricultural AI is not scarce. Usable agricultural AI is.', '@dimitratech’s protocol is designed to connect models, payments, and audit trails to real farm workflows.', 'The infrastructure behind the answer matters.'],
  ['Agriculture is local, but the infrastructure behind trust cannot be rebuilt from zero every time.', '@dimitratech is applying one data foundation across crops, countries, compliance, and finance.', 'Scale only matters when local reality still fits.']
];
const slugs = ['carbon-projects-mexico', 'connected-coffee-tanzania', 'fao-smart-farming', 'eudr-compliance', 'roraima-carbon-project', 'europe-commercial-momentum', 'connected-cacao-brazil', 'yield-prediction', 'dimitra-protocol-ai', 'agritech-across-origins'];
const prompts = [
  'dry northern Mexico rangelands, ranchers and mapped grassland parcels, carbon restoration corridor, satellite and field measurement represented as glowing land markers',
  'Tanzanian highland coffee cooperative, mapped small farms flowing into traceable coffee sacks and an export route, East African landscape',
  'global smart-farming conference idea visualized as one field-data backbone linking farms, sustainability verification, and finance across continents',
  'smallholder farms and European-bound crop supply chain, geolocation proof and deforestation monitoring linking farm plots to compliant export crates',
  'Roraima rainforest edge with productive farms beside preserved forest, community producers and a measured carbon corridor connecting conservation to income',
  'European agritech partnership table connecting field data, buyers, financiers, and carbon projects across Latin America and Africa',
  'Brazilian cacao smallholdings with healthy soil layers, shade trees, cacao pods, regenerative field guidance, and traceable cooperative records',
  'smallholder crop field with weather, satellite, and historical harvest signals converging into a clear forward yield path before harvest',
  'farm application connected to AI service nodes, privacy-preserving ledger trails, token payment flow, and real cooperative operations',
  'panoramic farms from different origins connected by one adaptable data backbone, coffee, cacao, rangeland, compliance, carbon, and finance'
];
const bulletChars = ['•', '◦', '▪', '•', '◦', '▪', '•', '◦', '▪', '•'];

function clean(s) { return s.replace(/^[\s\u25aa\u25e6\u2022\u25c6\u25b8\uFE0F]+/u, '').replace(/\s+/g, ' ').trim(); }
function parseBlock(block, day) {
  const lines = block.split('\n').map((x) => x.trim()).filter(Boolean);
  const title = lines.shift().replace(/^Article \d+:\s*/, '');
  const body = lines;
  const headings = [];
  for (let i = 0; i < body.length; i++) {
    if (!/^[•◦▪◾◽\-]/u.test(body[i]) && body[i].length > 15 && !body[i].endsWith('.')) headings.push(i);
  }
  const sections = [];
  for (let j = 0; j < headings.length; j++) {
    const start = headings[j];
    const end = headings[j + 1] ?? body.length;
    const heading = body[start];
    const bullets = body.slice(start + 1, end).filter((x) => /^[•◦▪◾◽\-]/u.test(x)).map(clean);
    if (bullets.length) sections.push({ heading, bullets: bullets.slice(0, 4) });
  }
  const intro = hooks[day - 1].join('\n');
  const date = new Date(Date.UTC(2026, 6, 21 + ((day - 1) * 2)));
  const iso = date.toISOString().slice(0, 10);
  const imagePath = `images/dimitra-batch-2026-07/day-${String(day).padStart(2, '0')}-${slugs[day - 1]}.png`;
  const visual = `Create an exact 5:2 ultrawide pixel-art editorial banner for Dimitra article Day ${day}: ${title}. Show ${prompts[day - 1]}. Use crisp 16-bit pixel blocks, premium agricultural editorial composition, grounded human scale, clear farm-to-market or field-to-proof storytelling, varied green, soil, gold, and blue palette. Keep the center and right side visually strong. Reserve a quiet upper-left or lower-left corner for a small Dimitra logo overlay added later at 50% opacity. No other text, letters, numbers, captions, fake UI, watermark, or logos. Avoid generic crypto imagery, futuristic clutter, photorealism, and unreadable detail.`;
  const articleSections = sections.slice(0, 4);
  if (articleSections.length < 4) {
    articleSections.push({ heading: 'What This Means in Practice', bullets: [body[body.length - 1].replace(/^Conclusion\s*/i, '').replace(/^[•◦▪◾◽\-\uFE0F]\s*/u, '').trim()] });
  }
  articleSections.push({ heading: 'Conclusion', bullets: [`Dimitra’s work turns the article’s central challenge into measurable agricultural infrastructure that can serve farmers, cooperatives, and markets.`] });
  const text = `${intro}\n\n${title}\n\n${articleSections.map((s, i) => `${i + 1}. ${s.heading}\n\n${s.bullets.map((b) => `${bulletChars[day - 1]} ${b}`).join('\n\n')}`).join('\n\n')}\n\nWhat part of this infrastructure matters most for the farmers and organizations it is meant to serve?`;
  return { day, date: iso, project: 'Dimitra', handle: '@dimitratech', title, format: 'long_x_post', text, sections: articleSections, imagePrompt: visual, imageUrl: `https://aarkay4153-code.github.io/fdv-ops-calendar/${imagePath}`, imageLocalPath: imagePath, sourceLinks: [] };
}
const posts = blocks.map((block, index) => parseBlock(block, index + 1));
fs.writeFileSync(path.join(outDir, 'posting_threads_dimitra_batch_2026-07.json'), JSON.stringify(posts, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'image_prompts_dimitra_batch_2026-07.json'), JSON.stringify(posts.map((p) => ({ day: p.day, project: p.project, handle: p.handle, title: p.title, prompt: p.imagePrompt, localPath: p.imageLocalPath, publicUrl: p.imageUrl })), null, 2) + '\n');
console.log(`Wrote ${posts.length} Dimitra posts and prompts.`);
