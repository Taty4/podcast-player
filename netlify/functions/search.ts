export const handler = async (event: any) => {
  const query = event.queryStringParameters?.term;

  const response = await fetch(
    "https://itunes.apple.com/search?term=${query}&media=podcast&limit=20",
  );

  const data = await response.json();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
};
