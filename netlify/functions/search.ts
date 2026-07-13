import type { Handler } from "@netlify/functions";
import { createHash } from "crypto";

export const handler: Handler = async (event) => {
  try {
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;

    if (!apiKey || !apiSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Podcast Index credentials are missing",
        }),
      };
    }

    const queryParams = {
      ...(event.queryStringParameters || {}),
    };

    const endpoint = queryParams.endpoint;

    if (!endpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing endpoint parameter",
        }),
      };
    }

    delete queryParams.endpoint;

    const params = new URLSearchParams(queryParams as Record<string, string>);

    const authDate = Math.floor(Date.now() / 1000).toString();

    console.log(
      `https://api.podcastindex.org/api/1.0/${endpoint}?${params.toString()}`,
    );

    const authorization = createHash("sha1")
      .update(apiKey + apiSecret + authDate)
      .digest("hex");

    console.log({
      headers: {
        "X-Auth-Key": apiKey,
        "X-Auth-Date": authDate,
        Authorization: authorization,
        "User-Agent": "PodcastApp/1.0",
      },
    });

    const response = await fetch(
      `https://api.podcastindex.org/api/1.0/${endpoint}?${params.toString()}`,
      {
        headers: {
          "X-Auth-Key": apiKey,
          "X-Auth-Date": authDate,
          Authorization: authorization,
          "User-Agent": "PodcastApp/1.0",
        },
      },
    );

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Server error",
      }),
    };
  }
};
