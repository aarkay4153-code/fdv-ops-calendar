const fs = require("fs");
const path = require("path");

const X_LONG_POST_LIMIT = 25000;
const POSTING_TIME_IST = "18:00";
const BUFFER_GRAPHQL_URL = "https://api.buffer.com";
const BULLET = "\u25aa\ufe0f";

const COMPACT_OPENINGS_BY_TITLE = {
  "Why Physical AI Needs NATIX Network’s Internet of Cameras":
    "@NATIXNetwork is betting Physical AI needs street-level camera data from everyday roads, not only expensive fleets. The bigger question is data freshness. Read on.",
  "NATIX VX360 Turns Tesla Cameras into a Physical AI Data Product":
    "@NATIXNetwork wants Tesla cameras to become useful road-intelligence supply. VX360 turns passive footage into a product for owners and Physical AI. Read on.",
  "How NATIX Converts Raw Dashcam Footage into Autonomous-Driving Intelligence":
    "@NATIXNetwork can collect huge dashcam footage, but raw video is not the prize. The value comes from turning it into trusted driving intelligence. Read on.",
  "Anyone Protocol’s 3-Hop Encrypted Relay Network for Decentralized Privacy":
    "@AnyoneFDN takes a simple privacy idea seriously: no single relay should see the full picture. Three encrypted hops split the trust problem. Read on.",
  "Community-Driven Node Supply and Bandwidth Capacity in Anyone’s Privacy Network":
    "@AnyoneFDN needs more than strong encryption. The network also needs community-run bandwidth that stays fast, reliable and worth supplying. Read on.",
  "Privacy Infrastructure for Agents, Devices, and Users Versus Centralized VPN Tools":
    "@AnyoneFDN is not only about private browsing. Agents, devices and machine networks may need privacy rails before they act at scale. Read on.",
  "AI-Native Asset Sourcing and Diligence in Penomo’s Infrastructure Finance Platform":
    "@penomoprotocol targets a quiet bottleneck in infrastructure finance: slow diligence. AI could help teams turn messy documents into faster decisions. Read on.",
  "Reducing Manual Reporting and Workflow Friction in Renewable Energy Infrastructure":
    "@penomoprotocol is focused on the reporting grind inside renewable assets. Less manual busywork could mean better decisions on real infrastructure. Read on.",
  "AI-Native Capital Formation for Energy Infrastructure Projects":
    "@penomoprotocol asks why clean-energy projects still struggle when capital exists. The answer may sit inside workflow friction and slow trust-building. Read on.",
  "Prize Incentives for Embodied AI Development on BitRobot Network":
    "@BitRobotNetwork uses prize incentives to push embodied AI builders toward real robotics problems. The model is simple: fund useful missions. Read on.",
  "Active Missions, Task Design, and Builder Incentives on BitRobot Network":
    "@BitRobotNetwork is testing active missions instead of narrow robotics demos. Good task design may decide whether builders create useful machines. Read on.",
  "Open Challenge Model Versus Closed Robotics Lab Approaches for Embodied AI":
    "@BitRobotNetwork challenges the closed-lab path for robotics. Open challenges could bring more builders to the same hard Physical AI problems. Read on.",
  "Dashcam Contributors as the Mapping Supply Layer in Hivemapper’s DePIN":
    "@Hivemapper turns ordinary drives into mapping supply. The key question is whether everyday contributors can keep roads fresher than fleets. Read on.",
  "Road Coverage Expansion and Map Update Processes in Hivemapper DePIN":
    "@Hivemapper bets maps should update through repeated road coverage, not occasional fleet visits. Freshness is the real infrastructure test. Read on.",
  "Logistics and Autonomous Driving Use Cases Enabled by Hivemapper Versus Centralized Mapping":
    "@Hivemapper matters because logistics and autonomous systems need fresher road data than normal drivers notice. Yesterday's map can be too old. Read on.",
  "Centimeter-Level Positioning Accuracy Through ROVR’s LiDAR and RTK Layer":
    "@ROVR_Network focuses on the gap between knowing the street and knowing the centimeter. Robots need precision before they can move safely. Read on.",
  "Precision Spatial Data Supporting Machine Navigation and Robotics Applications":
    "@ROVR_Network is building spatial data for machines that act, not just people who navigate. Precision can change how robots make decisions. Read on.",
  "ROVR’s Precision Spatial Data Layer Versus Consumer-Grade Mapping Approaches":
    "@ROVR_Network shows why consumer maps may not be enough for Physical AI. A few centimeters can matter when machines move in the real world. Read on.",
  "Community-Deployed Hotspots as Decentralized Wireless Infrastructure":
    "@helium asks whether communities can build wireless coverage without waiting for telecom giants. The deployment model is the real experiment. Read on.",
  "Coverage Visibility and Verification Through the Helium Explorer":
    "@helium makes decentralized coverage visible through its explorer. If anyone can inspect the network, claims become easier to test. Read on.",
  "Coverage Economics and Deployment Model Compared to Traditional Telecom Infrastructure":
    "@helium changes the coverage model by rewarding deployed supply instead of planning everything centrally. That shift changes who can build networks. Read on.",
  "DAO Ownership Model for Access to Humanoid Robotics Investments":
    "@xmaquinanetwork brings community ownership into humanoid robotics exposure. The question is whether access and decision quality can grow together. Read on.",
  "Treasury Transparency and Governance-Driven Capital Allocation in XMAQUINA":
    "@xmaquinanetwork puts robotics treasury activity in public view. For a DAO managing real capital, transparency is part of the product. Read on.",
  "Community DAO Exposure Versus Private Venture Capital for Humanoid Robotics":
    "@xmaquinanetwork sits between private robotics funds and community ownership. The trade-off is access, expertise, liquidity and governance. Read on.",
  "Machine Identities as the Coordination Layer for DePIN and Autonomous Devices":
    "@peaqnetwork starts from a simple machine-economy problem: devices need identities before they can earn, transact or coordinate. Read on.",
  "DePIN Application Ecosystem and Machine Onboarding Rails on peaq":
    "@peaqnetwork gives DePIN builders shared rails for onboarding machines. That could save teams from rebuilding the same infrastructure again. Read on.",
  "peaq’s Specialization for the Machine Economy Versus General-Purpose Smart Contract Chains":
    "@peaqnetwork argues machine apps need more than a generic smart contract chain. Native identity and coordination may be the edge. Read on.",
};

const PROJECT_FRAMES = {
  "NATIX Network": {
    opening:
      "NATIX Network is building a distributed camera network for the real world.",
    need:
      "Autonomous vehicles, mapping systems, robots, and spatial AI models need fresh information about roads, signs, traffic, construction, weather, and unusual edge cases.",
    gap: "That is the gap NATIX is trying to close.",
  },
  Anyone: {
    opening:
      "Anyone is building privacy infrastructure for users, agents, machines, and real-world networks.",
    need:
      "Data moving through physical infrastructure needs private, resilient paths before autonomous systems can coordinate safely across public networks.",
    gap: "That is the gap Anyone is trying to close.",
  },
  "Penomo Protocol": {
    opening:
      "Penomo Protocol is building AI-native finance infrastructure for renewable energy assets.",
    need:
      "Machine networks still depend on real energy, real financing, and credible reporting before physical infrastructure can scale.",
    gap: "That is the gap Penomo is trying to close.",
  },
  "BitRobot Network": {
    opening:
      "BitRobot Network is building an incentive layer for embodied AI and robotics missions.",
    need:
      "Robotics progress needs measurable tasks, public benchmarks, builders, and incentives instead of isolated demos inside closed environments.",
    gap: "That is the gap BitRobot is trying to close.",
  },
  Hivemapper: {
    opening:
      "Hivemapper is building a decentralized mapping network powered by everyday road contributors.",
    need:
      "Autonomy, logistics, robotics, and navigation systems need fresh maps because roads change faster than centralized refresh cycles.",
    gap: "That is the gap Hivemapper is trying to close.",
  },
  "ROVR Network": {
    opening:
      "ROVR Network is building high-precision spatial data infrastructure for robots, vehicles, and machine navigation.",
    need:
      "Physical AI needs precise location, geometry, and spatial context before machines can move reliably through real environments.",
    gap: "That is the gap ROVR is trying to close.",
  },
  Helium: {
    opening:
      "Helium is building decentralized wireless infrastructure for sensors, devices, and physical-world data.",
    need:
      "Machines need connectivity before they can report data, coordinate activity, or participate in real-world infrastructure networks.",
    gap: "That is the gap Helium is trying to close.",
  },
  XMAQUINA: {
    opening:
      "XMAQUINA is building a community ownership layer around humanoid robotics and physical AI assets.",
    need:
      "Robotics is capital intensive, usually private, and difficult for communities to access before the largest value accrues.",
    gap: "That is the gap XMAQUINA is trying to close.",
  },
  peaq: {
    opening:
      "peaq is building machine-economy infrastructure for DePIN apps, devices, and autonomous systems.",
    need:
      "Machines need identities, permissions, transactions, and coordination rails before autonomous infrastructure can scale across the physical world.",
    gap: "That is the gap peaq is trying to close.",
  },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function loadEnvFile(filePath = path.join(process.cwd(), ".env.local")) {
  if (!fs.existsSync(filePath)) return false;

  const text = fs.readFileSync(filePath, "utf8");
  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) return;

    const key = match[1];
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });

  return true;
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€�/g, '"')
    .replace(/â€”/g, "-")
    .replace(/â€“/g, "-")
    .replace(/Ã¢â‚¬â„¢/g, "'")
    .replace(/Ã¢â‚¬Ëœ/g, "'")
    .replace(/Ã¢â‚¬Å“/g, '"')
    .replace(/Ã¢â‚¬ï¿½/g, '"')
    .replace(/Ã¢â‚¬â€/g, "-")
    .replace(/Ã¢â‚¬â€œ/g, "-")
    .replace(/Ã‚/g, "")
    .replace(/\s+([.,:;?!])/g, "$1")
    .replace(/[^\S\n]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function singleLine(value) {
  return normalizeText(value).replace(/\s+/g, " ").trim();
}

function ensurePeriod(value) {
  const text = singleLine(value);
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function parseStartDateYmd(startDate) {
  const match = String(startDate || "").match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) {
    throw new Error(`Invalid startDate: ${startDate}`);
  }
  return match[1];
}

function addDaysYmd(ymd, days) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function getPostDate(startDate, day) {
  return addDaysYmd(parseStartDateYmd(startDate), Number(day) - 1);
}

function splitBodySections(body) {
  const groups = normalizeText(body)
    .split(/\n\s*\n/)
    .map((group) => group.trim())
    .filter(Boolean);

  return groups.map((group) => {
    const lines = group
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const heading = singleLine(lines.shift() || "Key point");
    const bullets = lines
      .map((line) => ensurePeriod(line.replace(/^[-*]\s*/, "")))
      .filter(Boolean);
    return { heading, bullets };
  });
}

function frameForProject(project) {
  return (
    PROJECT_FRAMES[project] || {
      opening: `${project} is building infrastructure for the physical world.`,
      need:
        "Physical AI needs data, coordination, trust, and useful infrastructure before machines can operate reliably outside controlled environments.",
      gap: `That is the gap ${project} is trying to close.`,
    }
  );
}

function formatSection(index, section) {
  const bullets = section.bullets.slice(0, 4);
  return [
    `${index}. ${section.heading}`,
    "",
    ...bullets.flatMap((bullet) => [`${BULLET} ${bullet}`, ""]),
  ]
    .join("\n")
    .trim();
}

function conclusionBullets(post) {
  const project = post.project;
  const conclusion = ensurePeriod(post.conclusion);
  const generic = [
    conclusion,
    `The strongest version of ${project} is not the narrative alone, but the infrastructure loop between useful supply, verification, demand, and repeated real-world output.`,
    "The risk is execution: data quality, buyer demand, incentives, distribution, and trust still decide whether the network compounds beyond early attention.",
    `${project} stays worth tracking if it keeps turning its category thesis into measurable Physical AI and machine-economy utility.`,
  ];

  return generic.map(ensurePeriod);
}

function openingBlockForPost(post) {
  const compactOpening = COMPACT_OPENINGS_BY_TITLE[post.title];

  if (compactOpening) {
    return [ensurePeriod(compactOpening)];
  }

  return [
    ensurePeriod(post.preview),
    "",
    ensurePeriod(post.intro),
    "",
    "How? Read on.",
  ];
}

function buildLongPostText(post, sections) {
  const frame = frameForProject(post.project);
  const cta = ensurePeriod(post.cta);
  const bodySections = sections.slice(0, 4);
  const conclusionSection = {
    heading: "Conclusion",
    bullets: conclusionBullets(post),
  };
  const allSections = [...bodySections, conclusionSection];

  return [
    ...openingBlockForPost(post),
    "",
    post.title,
    "",
    frame.opening,
    "",
    "The idea is simple.",
    "",
    frame.need,
    "",
    frame.gap,
    "",
    ...allSections.flatMap((section, index) => [
      formatSection(index + 1, section),
      "",
    ]),
    cta,
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildPostForCalendarItem(post) {
  const sections = splitBodySections(post.body);
  const title = singleLine(post.title);
  const normalizedPost = {
    ...post,
    title,
    preview: singleLine(post.preview),
    intro: singleLine(post.intro),
    conclusion: singleLine(post.conclusion),
    cta: singleLine(post.cta),
  };

  const selectedSections = sections.slice(0, 4).map((section) => ({
    heading: section.heading,
    bullets: section.bullets.slice(0, 4),
  }));
  const outputSections = [
    ...selectedSections,
    { heading: "Conclusion", bullets: conclusionBullets(normalizedPost) },
  ];

  return {
    day: normalizedPost.day,
    date: normalizedPost.date,
    project: normalizedPost.project,
    handle: normalizedPost.handle,
    title,
    format: "long_x_post",
    text: buildLongPostText(normalizedPost, selectedSections),
    sections: outputSections,
    imagePrompt: normalizeText(normalizedPost.imagePrompt),
    imageUrl: normalizedPost.imageUrl || null,
    imageLocalPath: normalizedPost.imageLocalPath || null,
    sourceLinks: normalizedPost.sourceLinks || [],
  };
}

function buildPostingThreads(calendarData) {
  const startDate = calendarData.startDate;
  const posts = Array.isArray(calendarData.posts) ? calendarData.posts : [];
  const promptPath = path.join(process.cwd(), "image_prompts.json");
  const imagePromptByDay = fs.existsSync(promptPath)
    ? new Map(readJson(promptPath).map((prompt) => [prompt.day, prompt]))
    : new Map();

  return posts.map((post) => {
    const image = imagePromptByDay.get(post.day);
    const imageLocalPath = image && image.localPath;
    const imageExists =
      imageLocalPath && fs.existsSync(path.join(process.cwd(), imageLocalPath));
    return buildPostForCalendarItem({
      ...post,
      date: getPostDate(startDate, post.day),
      imageUrl: imageExists ? image.publicUrl : null,
      imageLocalPath: imageExists ? imageLocalPath : null,
      imagePrompt: image ? image.prompt : post.imagePrompt,
    });
  });
}

function validatePostingThread(post) {
  const errors = [];

  if (!post.day) errors.push("missing day");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date || "")) {
    errors.push("missing or invalid date");
  }
  if (!post.title) errors.push("missing title");
  if (post.format !== "long_x_post") {
    errors.push("format must be long_x_post");
  }
  if (typeof post.text !== "string" || !post.text.trim()) {
    errors.push("missing text");
  }
  if ((post.text || "").length > X_LONG_POST_LIMIT) {
    errors.push(`text is ${post.text.length}/${X_LONG_POST_LIMIT} chars`);
  }
  if ((post.text || "").includes("#DePIN #PhysicalAI #MachineEconomy")) {
    errors.push("text still includes removed hashtag block");
  }
  if (/not financial advice/i.test(post.text || "")) {
    errors.push("text still includes not-financial-advice reminder");
  }
  if (!Array.isArray(post.sections) || post.sections.length !== 5) {
    errors.push("expected 5 sections");
  }
  if (post.sections && post.sections[4] && post.sections[4].heading !== "Conclusion") {
    errors.push("section 5 must be Conclusion");
  }
  (post.sections || []).forEach((section, index) => {
    if (!section.heading) errors.push(`section ${index + 1} missing heading`);
    if (!Array.isArray(section.bullets) || section.bullets.length < 3) {
      errors.push(`section ${index + 1} needs at least 3 bullets`);
    }
  });

  return errors;
}

function validatePostingThreads(posts) {
  const errors = [];
  posts.forEach((post) => {
    const postErrors = validatePostingThread(post);
    postErrors.forEach((error) => errors.push(`Day ${post.day}: ${error}`));
  });
  return errors;
}

function findPostByDate(posts, date) {
  return posts.find((post) => post.date === date) || null;
}

function findPostByDay(posts, day) {
  return posts.find((post) => Number(post.day) === Number(day)) || null;
}

function istDateTimeToUtcIso(dateYmd, timeIst = POSTING_TIME_IST) {
  const [year, month, day] = dateYmd.split("-").map(Number);
  const [hour, minute] = timeIst.split(":").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));
  return utc.toISOString();
}

function kolkataTodayYmd(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function defaultTargetDate(now = new Date()) {
  return addDaysYmd(kolkataTodayYmd(now), 1);
}

function parseArgs(argv) {
  const args = {
    dryRun: false,
    date: null,
    day: null,
    scheduleDate: null,
    file: path.join(process.cwd(), "posting_threads.json"),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--date") {
      args.date = argv[++index];
    } else if (arg.startsWith("--date=")) {
      args.date = arg.slice("--date=".length);
    } else if (arg === "--day") {
      args.day = Number(argv[++index]);
    } else if (arg.startsWith("--day=")) {
      args.day = Number(arg.slice("--day=".length));
    } else if (arg === "--schedule-date") {
      args.scheduleDate = argv[++index];
    } else if (arg.startsWith("--schedule-date=")) {
      args.scheduleDate = arg.slice("--schedule-date=".length);
    } else if (arg === "--file") {
      args.file = argv[++index];
    } else if (arg.startsWith("--file=")) {
      args.file = arg.slice("--file=".length);
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (args.date && !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
    throw new Error("--date must use YYYY-MM-DD");
  }
  if (args.scheduleDate && !/^\d{4}-\d{2}-\d{2}$/.test(args.scheduleDate)) {
    throw new Error("--schedule-date must use YYYY-MM-DD");
  }
  if (args.day !== null && (!Number.isInteger(args.day) || args.day < 1)) {
    throw new Error("--day must be a positive integer");
  }

  return args;
}

function buildCreatePostInput({ post, channelId, dueAt }) {
  const input = {
    text: post.text,
    channelId,
    schedulingType: "automatic",
    mode: "customScheduled",
    dueAt,
  };

  if (post.imageUrl) {
    input.assets = [
      {
        image: {
          url: post.imageUrl,
        },
      },
    ];
  }

  return input;
}

async function createBufferPost({
  apiKey,
  input,
  fetchImpl = globalThis.fetch,
  endpoint = BUFFER_GRAPHQL_URL,
}) {
  if (!apiKey) {
    throw new Error("BUFFER_API_KEY is required unless --dry-run is used.");
  }
  if (!fetchImpl) {
    throw new Error("This Node runtime does not provide fetch.");
  }

  const query = `
    mutation CreateScheduledPost($input: CreatePostInput!) {
      createPost(input: $input) {
        __typename
        ... on PostActionSuccess {
          post {
            id
            status
            dueAt
            text
            channelId
          }
        }
        ... on MutationError {
          message
        }
      }
    }
  `;

  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables: { input } }),
  });

  let body;
  try {
    body = await response.json();
  } catch (error) {
    body = { parseError: error.message };
  }

  if (!response.ok) {
    const detail = body && (body.message || body.error || JSON.stringify(body));
    throw new Error(`Buffer API HTTP ${response.status}: ${detail}`);
  }

  if (body.errors && body.errors.length) {
    throw new Error(`Buffer GraphQL error: ${body.errors[0].message}`);
  }

  const result = body.data && body.data.createPost;
  if (!result) {
    throw new Error(`Buffer API returned no createPost result: ${JSON.stringify(body)}`);
  }

  if (result.__typename === "MutationError" || result.message) {
    throw new Error(`Buffer scheduling failed: ${result.message || "unknown error"}`);
  }

  if (!result.post || !result.post.id) {
    throw new Error(`Buffer scheduling returned an unexpected result: ${JSON.stringify(result)}`);
  }

  return result.post;
}

async function getBufferChannel({
  apiKey,
  channelId,
  fetchImpl = globalThis.fetch,
  endpoint = BUFFER_GRAPHQL_URL,
}) {
  if (!apiKey) {
    throw new Error("BUFFER_API_KEY is required.");
  }
  if (!channelId) {
    throw new Error("BUFFER_CHANNEL_ID is required.");
  }
  if (!fetchImpl) {
    throw new Error("This Node runtime does not provide fetch.");
  }

  const query = `
    query GetChannel($id: ChannelId!) {
      channel(input: { id: $id }) {
        id
        name
        displayName
        service
        isQueuePaused
      }
    }
  `;

  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables: { id: channelId } }),
  });

  let body;
  try {
    body = await response.json();
  } catch (error) {
    body = { parseError: error.message };
  }

  if (!response.ok) {
    const detail = body && (body.message || body.error || JSON.stringify(body));
    throw new Error(`Buffer API HTTP ${response.status}: ${detail}`);
  }

  if (body.errors && body.errors.length) {
    throw new Error(`Buffer GraphQL error: ${body.errors[0].message}`);
  }

  if (!body.data || !body.data.channel) {
    throw new Error(
      `No Buffer channel was found for BUFFER_CHANNEL_ID=${channelId}`
    );
  }

  return body.data.channel;
}

async function scheduleBufferThread({
  posts,
  date = defaultTargetDate(),
  day = null,
  scheduleDate = null,
  dryRun = false,
  apiKey = process.env.BUFFER_API_KEY,
  channelId = process.env.BUFFER_CHANNEL_ID,
  fetchImpl = globalThis.fetch,
}) {
  const post = day === null ? findPostByDate(posts, date) : findPostByDay(posts, day);
  if (!post) {
    return {
      status: "skipped",
      date,
      day,
      message:
        day === null
          ? `No posting article found for ${date}.`
          : `No posting article found for Day ${day}.`,
    };
  }

  const errors = validatePostingThread(post);
  if (errors.length) {
    throw new Error(`Posting article is not valid: ${errors.join("; ")}`);
  }

  const scheduledDate = scheduleDate || (day === null ? post.date : date);
  const dueAt = istDateTimeToUtcIso(scheduledDate, POSTING_TIME_IST);
  const input = buildCreatePostInput({
    post,
    channelId: channelId || "BUFFER_CHANNEL_ID_REQUIRED_FOR_LIVE_RUN",
    dueAt,
  });

  if (dryRun) {
    return {
      status: "dry-run",
      date: scheduledDate,
      originalDate: post.date,
      dueAt,
      post,
      input,
    };
  }

  if (!channelId) {
    throw new Error("BUFFER_CHANNEL_ID is required unless --dry-run is used.");
  }

  const scheduledPost = await createBufferPost({
    apiKey,
    input,
    fetchImpl,
  });

  return {
    status: "scheduled",
    date: scheduledDate,
    originalDate: post.date,
    dueAt,
    post,
    bufferPost: scheduledPost,
  };
}

module.exports = {
  BUFFER_GRAPHQL_URL,
  POSTING_TIME_IST,
  X_LONG_POST_LIMIT,
  addDaysYmd,
  buildCreatePostInput,
  buildPostingThreads,
  createBufferPost,
  defaultTargetDate,
  findPostByDate,
  findPostByDay,
  getBufferChannel,
  getPostDate,
  istDateTimeToUtcIso,
  kolkataTodayYmd,
  loadEnvFile,
  normalizeText,
  parseArgs,
  readJson,
  scheduleBufferThread,
  splitBodySections,
  validatePostingThread,
  validatePostingThreads,
  writeJson,
};
