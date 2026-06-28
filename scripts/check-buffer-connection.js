#!/usr/bin/env node
const { getBufferChannel, loadEnvFile } = require("./posting-thread-core");

async function main() {
  loadEnvFile();

  const channel = await getBufferChannel({
    apiKey: process.env.BUFFER_API_KEY,
    channelId: process.env.BUFFER_CHANNEL_ID,
  });

  const service = String(channel.service || "").toLowerCase();
  const looksLikeX = service.includes("twitter") || service.includes("x");

  console.log("Buffer connection works.");
  console.log(
    JSON.stringify(
      {
        channelId: channel.id,
        name: channel.displayName || channel.name,
        service: channel.service,
        isQueuePaused: channel.isQueuePaused,
        looksLikeXChannel: looksLikeX,
      },
      null,
      2
    )
  );

  if (!looksLikeX) {
    console.warn(
      "Warning: Buffer did not report this channel as Twitter/X. Confirm the channel ID before scheduling live posts."
    );
  }
}

main().catch((error) => {
  if (/Invalid ChannelId format/i.test(error.message)) {
    console.error(
      "BUFFER_CHANNEL_ID is not a valid Buffer channel ID. It looks like you pasted an email, handle, or account name instead of Buffer's internal channel ID."
    );
    process.exit(1);
  }

  if (/No Buffer channel was found/i.test(error.message)) {
    console.error(
      "Buffer accepted the channel ID format, but no connected channel was found for it."
    );
    process.exit(1);
  }

  console.error(error.message);
  process.exit(1);
});
