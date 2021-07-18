// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { WebClient } = require('@slack/web-api');

export default async (req, res) => {
  res.statusCode = 200

  // Create a new instance of the WebClient class with the token read from your environment variable
  const web = new WebClient(process.env.SLACK_TOKEN);
  // The current date
  const currentTime = new Date().toTimeString();

  await web.chat.postMessage({
    channel: '#general',
    text: `The current time is ${currentTime}`,
  });

  res.json({ currentTime });

}
