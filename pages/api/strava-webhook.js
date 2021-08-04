import { getActivity, getAthleteToken } from '../../util/strava.tsx';
const { WebClient } = require('@slack/web-api');
const { generateMap } = require('../../util/screenshot');
import { connectToDatabase } from '../../util/mongodb'

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
    console.log("webhook event received!", req.body);
    const { db } = await connectToDatabase();

    const requestData = req.body;
    const objectId = Number(req.body.object_id);
    const webhookUpdate = req.body.aspect_type;

    if(!webhookUpdate || !objectId || !requestData.owner_id) {
      return res.status(500).json({ message: 'invalid strava webhook' });
    }
  
    // switch (webhookUpdate) {
    //   case 'delete':
    //     // remove activity
    //     break;
    //   case 'create':
    //   case 'update':

    //   default:

    //     break;
    // }

    if (webhookUpdate === 'delete') {
      // delete activity
      await db
        .collection('activity')
        .deleteOne({ id: objectId})
      
      // delete slack message

      return res.status(200).json({ status: 'deleted' });
    }

    const query = { object_id: objectId };
    const update = { $set: requestData };
    await db
      .collection('webhook')
      .updateOne(query, update, { upsert: true })

    const token = await getAthleteToken(requestData.owner_id);

    // 2. get activity data from strava
    const activity = await getActivity(objectId, token.access_token);

    // 3. create map
    // const map = await generateMap({ polyline: activity.map.summary_polyline, id: objectId });
    const map = {};
    const data = { ...activity, map: map.path };

    // Save activity data
    const activityQuery = { id: activity.id };
    const activityUpdate = { $set: data };

    await db
      .collection('activity')
      .updateOne(activityQuery, activityUpdate, { upsert: true })

    // 4. send slack message with data and map
    // Create a new instance of the WebClient class with the token read from your environment variable
    const web = new WebClient(process.env.SLACK_TOKEN);
    // The current date
    const currentTime = new Date().toTimeString();

    await web.chat.postMessage({
      channel: '#general',
      text: `EVENT_RECEIVED, ${data.object_id}, ${data.aspect_type}, ${data.map}, ${activity.name}`,
    });
    
    return res.status(200).json({map: map, activity});
  }

};