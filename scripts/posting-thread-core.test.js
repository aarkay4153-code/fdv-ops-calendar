const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildCreatePostInput,
  buildPostingThreads,
  createBufferPost,
  defaultTargetDate,
  istDateTimeToUtcIso,
  scheduleBufferThread,
  validatePostingThreads,
} = require("./posting-thread-core");

const calendarFixture = {
  startDate: "2026-06-24T00:00:00+05:30",
  posts: [
    {
      day: 1,
      project: "NATIX Network",
      handle: "@NATIXNetwork",
      title: "Why Physical AI Needs NATIX Network’s Internet of Cameras",
      preview:
        "Physical AI needs fresh camera data from real roads, traffic, signs, weather, and edge cases.",
      intro:
        "@NATIXNetwork is building a distributed camera network for real-world visual intelligence.",
      body: [
        "Physical AI Has a Real-World Data Bottleneck",
        "- Models operating in physical environments require recent footage of roads, signs, traffic behavior, and unusual edge cases.",
        "- Centralized collection fleets can only revisit a limited number of locations on fixed schedules.",
        "- NATIX attempts to close that gap by activating cameras already moving through streets every day.",
        "",
        "How the Distributed Collection Model Works",
        "- NATIX uses smartphones and multi-camera vehicle systems as collection devices rather than relying only on specialist mapping vehicles.",
        "- Its software analyzes video streams and prepares contributed data for mapping or Physical AI applications.",
        "- The network validates data authenticity and accuracy before productizing the useful output.",
        "",
        "From Cameras to Physical AI Products",
        "- Video can become structured intelligence for autonomous-system developers and mapping products.",
        "- Edge-case extraction can help surface unusual road situations that are expensive to collect deliberately.",
        "- The network value depends on converting footage into data products buyers can use.",
        "",
        "Why This Differs from Drive-to-Earn",
        "- Contributor rewards may attract supply, but the durable business depends on useful output.",
        "- Privacy, validation, quality, and buyer requirements must work together before footage becomes valuable.",
        "- NATIX should be judged by data usefulness and customer demand, not only driver registrations.",
      ].join("\n"),
      conclusion:
        "NATIX becomes important if distributed cameras produce useful data for Physical AI buyers.",
      cta: "Which NATIX output has the strongest commercial potential?",
      imagePrompt: "An ultrawide road camera data network illustration.",
      sourceLinks: ["https://www.natix.network/"],
    },
  ],
};

test("buildPostingThreads creates dated long X posts", () => {
  const posts = buildPostingThreads(calendarFixture);

  assert.equal(posts.length, 1);
  assert.equal(posts[0].date, "2026-06-24");
  assert.equal(posts[0].format, "long_x_post");
  assert.equal(posts[0].sections.length, 5);
  assert.equal(posts[0].sections[4].heading, "Conclusion");
  assert.deepEqual(validatePostingThreads(posts), []);
  assert.ok(posts[0].text.includes("Read on."));
  assert.ok(!posts[0].text.includes("How? Read on."));
  assert.ok(!posts[0].text.includes("#DePIN #PhysicalAI #MachineEconomy"));
  assert.ok(!/not financial advice/i.test(posts[0].text));
});

test("istDateTimeToUtcIso converts 18:00 IST to 12:30 UTC", () => {
  assert.equal(
    istDateTimeToUtcIso("2026-06-29"),
    "2026-06-29T12:30:00.000Z"
  );
});

test("defaultTargetDate uses tomorrow in Asia/Kolkata", () => {
  const now = new Date("2026-06-28T18:45:00.000Z");
  assert.equal(defaultTargetDate(now), "2026-06-30");
});

test("buildCreatePostInput creates a single long-post Buffer payload", () => {
  const [post] = buildPostingThreads(calendarFixture);
  const input = buildCreatePostInput({
    post,
    channelId: "x-channel-123",
    dueAt: "2026-06-24T12:30:00.000Z",
  });

  assert.equal(input.mode, "customScheduled");
  assert.equal(input.channelId, "x-channel-123");
  assert.equal(input.dueAt, "2026-06-24T12:30:00.000Z");
  assert.equal(input.text, post.text);
  assert.equal(input.metadata, undefined);
});

test("scheduleBufferThread dry-run returns the selected long post and payload", async () => {
  const posts = buildPostingThreads(calendarFixture);
  const result = await scheduleBufferThread({
    posts,
    date: "2026-06-24",
    dryRun: true,
  });

  assert.equal(result.status, "dry-run");
  assert.equal(result.post.day, 1);
  assert.equal(result.post.format, "long_x_post");
  assert.equal(result.dueAt, "2026-06-24T12:30:00.000Z");
  assert.equal(result.input.text, result.post.text);
});

test("scheduleBufferThread can schedule a day number on a replacement date", async () => {
  const posts = buildPostingThreads(calendarFixture);
  const result = await scheduleBufferThread({
    posts,
    day: 1,
    scheduleDate: "2026-06-28",
    dryRun: true,
  });

  assert.equal(result.status, "dry-run");
  assert.equal(result.post.day, 1);
  assert.equal(result.originalDate, "2026-06-24");
  assert.equal(result.date, "2026-06-28");
  assert.equal(result.dueAt, "2026-06-28T12:30:00.000Z");
});

test("scheduleBufferThread skips dates outside the calendar", async () => {
  const posts = buildPostingThreads(calendarFixture);
  const result = await scheduleBufferThread({
    posts,
    date: "2026-07-30",
    dryRun: true,
  });

  assert.equal(result.status, "skipped");
});

test("createBufferPost handles a successful Buffer response", async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({
      data: {
        createPost: {
          __typename: "PostActionSuccess",
          post: {
            id: "post-123",
            status: "scheduled",
            dueAt: "2026-06-24T12:30:00.000Z",
            text: "hello",
            channelId: "x-channel-123",
          },
        },
      },
    }),
  });

  const post = await createBufferPost({
    apiKey: "test-key",
    input: { text: "hello" },
    fetchImpl,
  });

  assert.equal(post.id, "post-123");
});

test("createBufferPost reports quota or plan-limit errors", async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({
      data: {
        createPost: {
          __typename: "MutationError",
          message: "Your current plan has reached the long post limit.",
        },
      },
    }),
  });

  await assert.rejects(
    createBufferPost({
      apiKey: "test-key",
      input: { text: "hello" },
      fetchImpl,
    }),
    /long post limit/
  );
});

test("createBufferPost reports disconnected channel or invalid token responses", async () => {
  const fetchImpl = async () => ({
    ok: false,
    status: 401,
    json: async () => ({ message: "Invalid token or disconnected channel" }),
  });

  await assert.rejects(
    createBufferPost({
      apiKey: "bad-key",
      input: { text: "hello" },
      fetchImpl,
    }),
    /Invalid token or disconnected channel/
  );
});
