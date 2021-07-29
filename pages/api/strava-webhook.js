const { WebClient } = require('@slack/web-api');
const { generateMap } = require('../../util/screenshot');
import { connectToDatabase } from '../../util/mongodb'
import { getActivity } from '../../util/strava.tsx';

export default async function handler(req, res) {
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
    // 1. save token in db
    const { db } = await connectToDatabase();
    await db
      .collection('webhook')
      .insertOne(req.body)

    const token = await db
      .collection('tokens')
      .findOne({ athlete_id: Number(req.body.owner_id) });

    console.log('token', token)
    // 2. get activity data from strava
    const activity = await getActivity(req.body.object_id, token.access_token);

    // 3. create map
    const map = await generateMap({ polyline: activity.map.summary_polyline, id: req.body.object_id });
    const data = { ...activity, map: map.path };

    // Save activity data
    await db
      .collection('activity')
      .insertOne(data)
    // 4. send slack message with data and map
    // Create a new instance of the WebClient class with the token read from your environment variable
    const web = new WebClient(process.env.SLACK_TOKEN);
    // The current date
    const currentTime = new Date().toTimeString();

    await web.chat.postMessage({
      channel: '#general',
      text: `EVENT_RECEIVED, ${data.map}, ${activity.name}`,
    });
    
    return res.status(200).json({map: map, activity});
  }

};