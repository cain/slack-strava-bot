const { WebClient } = require('@slack/web-api');


export default async (req, res) => {
  console.log(req.method)
  if(req.method === 'GET') {
      // Your verify token. Should be a random string.
    const VERIFY_TOKEN = "STRAVA";
    // Parses the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Verifies that the mode and token sent are valid
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {     
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.json({"hub.challenge":challenge});  
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        // res.sendStatus(403); 
        res.status(403).send('verify tokens do not match')
      }
    } else {
      res.json('No token supplied')
    }
  } else if(req.method === 'POST') {
    console.log("webhook event received!", req.query, req.body);
    res.status(200).send('EVENT_RECEIVED');

      // Create a new instance of the WebClient class with the token read from your environment variable
      const web = new WebClient(process.env.SLACK_TOKEN);
      // The current date
      const currentTime = new Date().toTimeString();

      await web.chat.postMessage({
        channel: '#general',
        text: 'EVENT_RECEIVED',
      });
  }

};