const { WebClient } = require('@slack/web-api');
var axios = require('axios');

export async function sendMessage({ message, channel }) {
  // Create a new instance of the WebClient class with the token read from your environment variable
  const web = new WebClient(process.env.SLACK_TOKEN);
  // The current date
  // const currentTime = new Date().toTimeString();

  await web.chat.postMessage({
    channel: channel ? channel : '#general',
    text: `${message}`,
  });
}

export async function getAuthToken(code: string, redirect_uri: string) {
  return new Promise<any>((res, rej) => {
    var config = {
      method: 'post',
      url: `https://slack.com/api/oauth.v2.access`,
      params: { 
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_SECRET,
        code,
        redirect_uri,
      }
    };
    console.log(config);
    
    axios(config)
      .then(function (response) {
        console.log(response);
        res(response.data);
      })
      .catch(function (error) {
        rej(error);
      });
  })
}

// https://app.slack.com/block-kit-builder/T3XCDJE4R#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22Danny%20Torrence%20left%20the%20following%20review%20for%20your%20property:%22%7D%7D,%7B%22type%22:%22section%22,%22block_id%22:%22section567%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%3Chttps://example.com%7COverlook%20Hotel%3E%20%5Cn%20:star:%20%5Cn%20Doors%20had%20too%20many%20axe%20holes,%20guest%20in%20room%20237%20was%20far%20too%20rowdy,%20whole%20place%20felt%20stuck%20in%20the%201920s.%22%7D,%22accessory%22:%7B%22type%22:%22image%22,%22image_url%22:%22https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg%22,%22alt_text%22:%22Haunted%20hotel%20image%22%7D%7D,%7B%22type%22:%22section%22,%22block_id%22:%22section789%22,%22fields%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Average%20Rating*%5Cn1.0%22%7D%5D%7D%5D%7D