const fs = require("fs");

const postsPath = "posting_threads.json";
const posts = JSON.parse(fs.readFileSync(postsPath, "utf8"));

const bulletByDay = ["🔹", "▪️", "◾", "🔸"];

const intros = {
  1: [
    "Physical AI does not starve for models. It starves for fresh street data from roads changing every hour.",
    "With @NATIXNetwork, everyday cameras can become a live sensing layer for traffic, signs, weather, and edge cases machines need.",
    "Let’s dive deeper 👇",
  ],
  2: [
    "Tesla cameras may be more valuable when they are not just recording for the driver but feeding a larger data market.",
    "With VX360, @NATIXNetwork turns parked camera supply into road intelligence owners and Physical AI buyers can both use.",
    "Let’s look closer 👇",
  ],
  3: [
    "Raw dashcam footage is not intelligence. Most of it is noise until someone can structure it.",
    "@NATIXNetwork’s harder task is turning moving camera streams into trusted data for autonomy, maps, and simulation.",
    "Here’s the deeper story 👇",
  ],
  4: [
    "Privacy breaks when one relay knows too much. The fix is not just stronger encryption or a nicer VPN interface.",
    "@AnyoneFDN splits traffic across three encrypted hops so no single operator can see the full path a user takes.",
    "Let’s break it down 👇",
  ],
  5: [
    "Privacy networks do not fail because encryption is weak. They fail when capacity dries up.",
    "For @AnyoneFDN, the real test is sharper: can thousands of community relays keep bandwidth fast, reliable, and worth running as demand grows?",
    "Let’s look closer 👇",
  ],
  6: [
    "VPNs were built for people browsing the internet. The next privacy problem is bigger.",
    "@AnyoneFDN points toward private rails for users, agents, and devices that may need to coordinate without exposing every move.",
    "This gets interesting 👇",
  ],
  7: [
    "Infrastructure finance does not slow down only because capital is scarce. Diligence and messy risk checks are the drag.",
    "@penomoprotocol is aiming AI at messy asset data so renewable projects can move from intake to decision faster.",
    "Let’s go deeper 👇",
  ],
  8: [
    "Renewable infrastructure can drown in reporting long before the asset itself becomes the issue.",
    "@penomoprotocol targets the manual workflow layer where reports, checks, updates, and oversight still slow decisions.",
    "Here’s why it matters 👇",
  ],
  9: [
    "Clean-energy projects can have demand, assets, and capital, yet still get stuck in the middle.",
    "@penomoprotocol is focused on the trust and workflow friction that keeps infrastructure finance slower than it should be.",
    "Let’s unpack the mechanism 👇",
  ],
  10: [
    "Robotics does not advance just because a demo looks impressive. Builders need sharper missions tied to real performance.",
    "@BitRobotNetwork uses prize incentives to pull embodied AI work toward measurable tasks instead of vague lab progress.",
    "Let’s examine it 👇",
  ],
  11: [
    "The wrong task can waste months of robotics work. The right mission can focus an entire builder market.",
    "@BitRobotNetwork’s active missions test whether incentives can turn scattered AI talent into useful machine performance.",
    "Here’s the setup 👇",
  ],
  12: [
    "Closed robotics labs move carefully, but they cannot be the only path if useful robots need wider experimentation.",
    "@BitRobotNetwork’s open challenge model asks whether broader builder access can surface better robot behavior faster.",
    "Let’s compare it 👇",
  ],
  13: [
    "Maps age quietly. Every new sign, closure, lane change, or detour can make yesterday’s data less useful.",
    "@Hivemapper turns dashcam contributors into a decentralized road-data supply layer built from ordinary driving.",
    "Let’s look under the hood 👇",
  ],
  14: [
    "Road coverage is not a one-time job. The real battle is keeping maps fresh after the first pass.",
    "@Hivemapper depends on repeated community drives to expand coverage and update roads faster than centralized cycles.",
    "Here’s the catch 👇",
  ],
  15: [
    "A stale map is annoying for humans. For logistics and autonomy, it can become an operating risk the moment roads change.",
    "@Hivemapper’s case is strongest where fresher road data can support fleets, routing, and machine navigation.",
    "Let’s go further 👇",
  ],
  16: [
    "Knowing the street is not enough when a machine needs the centimeter and one small error can change the decision.",
    "@ROVR_Network combines LiDAR and RTK-style precision so robots and vehicles can reason about real space more accurately.",
    "Let’s zoom in 👇",
  ],
  17: [
    "Machines do not navigate with vibes. They need spatial data precise enough to act on when the real world gets messy.",
    "@ROVR_Network’s thesis is that robotics applications need richer geometry than consumer-grade maps usually provide.",
    "Here’s the detail 👇",
  ],
  18: [
    "Consumer maps can be good enough for people and still be too sloppy for Physical AI when machines have to move safely.",
    "@ROVR_Network’s edge is precision spatial data where a few centimeters can change whether a machine moves safely.",
    "Let’s make it clear 👇",
  ],
  19: [
    "Wireless coverage does not always need to start with a telecom giant and a giant capex plan that takes years to justify.",
    "@helium tests whether communities can deploy hotspots that turn local supply into decentralized connectivity.",
    "Let’s trace the model 👇",
  ],
  20: [
    "Decentralized networks need proof people can inspect. Otherwise coverage becomes just another claim.",
    "@helium’s explorer makes hotspot activity and coverage visible, turning network growth into something users can verify.",
    "Let’s look closer 👇",
  ],
  21: [
    "Telecom builds from the center. DePIN asks what happens when coverage starts at the edge.",
    "@helium changes the economics by rewarding deployed wireless supply instead of relying only on centralized rollout plans.",
    "Here’s the shift 👇",
  ],
  22: [
    "Humanoid robotics is usually a private-capital game. Most communities only watch while the upside compounds elsewhere.",
    "@xmaquinanetwork uses a DAO ownership model to open access to robotics exposure, governance, and capital allocation.",
    "Let’s dig in 👇",
  ],
  23: [
    "A robotics DAO cannot just talk about ownership. It has to show how capital moves.",
    "@xmaquinanetwork’s treasury transparency matters because governance is only credible when allocation can be inspected.",
    "Here’s where it gets real 👇",
  ],
  24: [
    "Private robotics funds offer access to a few. Community DAOs ask whether that gate can open wider without losing discipline.",
    "@xmaquinanetwork sits between venture-style robotics exposure and public governance, with different trade-offs.",
    "Let’s weigh it 👇",
  ],
  25: [
    "Machines need identity before they can join an economy. Without it, coordination breaks early.",
    "@peaqnetwork is building machine identities so devices can transact, earn, prove activity, and connect across DePIN networks.",
    "Let’s follow the rails 👇",
  ],
  26: [
    "Every DePIN app should not have to rebuild machine onboarding from scratch before testing real-world demand.",
    "@peaqnetwork’s ecosystem thesis is that shared identity, coordination, and app rails can speed up physical-network deployment.",
    "Let’s map it out 👇",
  ],
  27: [
    "Generic chains can run machine apps, but that does not mean they are designed for machines that earn, verify, and coordinate.",
    "@peaqnetwork’s bet is specialization: native coordination, identity, and DePIN rails for the machine economy.",
    "Let’s close the loop 👇",
  ],
};

function replaceIntro(text, title, introLines) {
  const marker = `\n\n${title}\n\n`;
  const index = text.indexOf(marker);
  if (index === -1) {
    throw new Error(`Could not find title marker for ${title}`);
  }
  return `${introLines.join("\n")}${text.slice(index)}`;
}

function replaceBullets(text, bullet) {
  return text.replace(/^(🔹|▪️|◾|🔸)\s+/gmu, `${bullet} `);
}

const errors = [];

const updated = posts.map((post, index) => {
  const intro = intros[post.day];
  if (!intro) {
    errors.push(`Missing intro for day ${post.day}`);
    return post;
  }

  const introText = intro.join("\n");
  if (intro.length !== 3) errors.push(`Day ${post.day} intro is not 3 lines`);
  if (introText.length > 260) {
    errors.push(`Day ${post.day} intro is ${introText.length}/260 chars`);
  }
  if (intro[0].includes(post.handle)) {
    errors.push(`Day ${post.day} starts with handle in line 1`);
  }
  if (!intro[1].includes(post.handle)) {
    errors.push(`Day ${post.day} missing handle in line 2`);
  }
  if (!intro[2].endsWith("👇")) {
    errors.push(`Day ${post.day} line 3 does not end with pointer emoji`);
  }

  const bullet = bulletByDay[index % bulletByDay.length];
  const text = replaceBullets(replaceIntro(post.text, post.title, intro), bullet);
  const sections = post.sections.map((section) => ({
    ...section,
    bullets: section.bullets.map((bulletText) =>
      bulletText.replace(/^(🔹|▪️|◾|🔸)\s+/u, "")
    ),
  }));

  return {
    ...post,
    text,
    sections,
  };
});

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

fs.writeFileSync(postsPath, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
console.log(
  updated
    .map((post, index) => {
      const intro = intros[post.day].join("\n");
      return `${post.day} | ${intro.length} | ${bulletByDay[index % bulletByDay.length]} | ${post.title}`;
    })
    .join("\n")
);
