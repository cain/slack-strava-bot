const { WebClient } = require('@slack/web-api');

  
export function sendMessage() {
  // Create a new instance of the WebClient class with the token read from your environment variable
  const web = new WebClient(process.env.SLACK_TOKEN);
  // The current date
  const currentTime = new Date().toTimeString();

  await web.chat.postMessage({
    channel: '#general',
    text: `The current time is ${currentTime}`,
  });
}

