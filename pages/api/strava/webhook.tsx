const { WebClient } = require('@slack/web-api');
const { generateMap } = require('../../../util/screenshot');
import { connectToDatabase } from '../../../util/mongodb'
import { getActivity, getAthleteToken } from '../../../util/strava';

export default async function handler(req, res) {
  console.log(req.method)
  if(req.method === 'GET') {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = "SLACKBOT";
    const { query } = req;
    const challenge = query['hub.challenge'];
    const mode = query['hub.mode'];
    const verifyToken = query['hub.verify_token'];

    // Checks if a token and mode is in the query string of the request
    if (mode && verifyToken) {
      // Verifies that the mode and token sent are valid
      if (mode === 'subscribe' && verifyToken === VERIFY_TOKEN) {     
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).json({"hub.challenge": challenge});  
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        // res.sendStatus(403); 
        res.status(403).send('verify tokens do not match')
      }
    } else {
      res.json('No token supplied')
    }
  } else if(req.method === 'POST') {
    // console.log("webhook event received!", req.body);
    const { db } = await connectToDatabase();

    const requestData = req.body;
    const objectId = Number(requestData.object_id);
    const webhookUpdate = requestData.aspect_type;
    console.log(requestData.aspect_type, webhookUpdate, objectId, requestData.owner_id)
    if(!webhookUpdate || !objectId || !requestData.owner_id) {
      return res.status(500).json({ message: 'invalid strava webhook' });
    }

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
    const map = { path: '' };
    const data = { ...activity, map: map.path };

    // Save activity data
    const activityQuery = { id: activity.id };
    const activityUpdate = { $set: data };

    await db
      .collection('activity')
      .updateOne(activityQuery, activityUpdate, { upsert: true })

    if(webhookUpdate === 'create') {
      try {
        const cursor = await db.collection('athlete-slack-channels').find({ athlete_id: requestData.owner_id });
        await cursor.forEach(async (dbDocument) => {
          console.log({ dbDocument: dbDocument })
          // 4. send slack message with data and map
          // Create a new instance of the WebClient class with the token read from your environment variable
          const web = new WebClient(process.env.SLACK_TOKEN);
          await web.chat.postMessage({
            channel: dbDocument.channel_id,
            text: `EVENT_RECEIVED, id: ${data.id}, aspect_type: ${webhookUpdate}, type: ${data.type}, map: ${data.map}, name: ${activity.name}`,
          });
        });
    
      } finally {
        // await client.close();
      }
    }

    return res.status(200).json({map: map, activity});
  }

};