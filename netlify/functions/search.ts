import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};

    const params = new URLSearchParams(queryParams as Record<string, string>);

    const endpoint = queryParams.id ? "lookup" : "search";
    const response = await fetch(
      `https://itunes.apple.com/${endpoint}?${params.toString()}`,
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          message: "iTunes API request failed",
        }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
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
