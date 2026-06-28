#!/usr/bin/env node
const { BUFFER_GRAPHQL_URL, loadEnvFile } = require("./posting-thread-core");

async function bufferRequest(query, variables = {}) {
  const apiKey = process.env.BUFFER_API_KEY;
  if (!apiKey) {
    throw new Error("BUFFER_API_KEY is required.");
  }

  const response = await fetch(BUFFER_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Buffer API HTTP ${response.status}: ${JSON.stringify(body)}`);
  }
  if (body.errors && body.errors.length) {
    throw new Error(`Buffer GraphQL error: ${body.errors[0].message}`);
  }
  return body.data;
}

function cleanChannel(channel) {
  return {
    id: channel.id,
    name: channel.displayName || channel.name,
    service: channel.service,
    isQueuePaused: channel.isQueuePaused,
  };
}

async function main() {
  loadEnvFile();

  const query = `
    query ListChannels {
      channels(input: {}) {
        id
        name
        displayName
        service
        isQueuePaused
      }
    }
  `;

  const data = await bufferRequest(query);
  const channels = Array.isArray(data.channels)
    ? data.channels
    : data.channels && Array.isArray(data.channels.items)
      ? data.channels.items
      : [];

  if (!channels.length) {
    console.log("No Buffer channels were returned for this API key.");
    return;
  }

  console.log(JSON.stringify(channels.map(cleanChannel), null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
