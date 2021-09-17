import { exchangeToken } from'../../../util/strava.tsx';
import { sendMessage } from '../../../util/slack.tsx';
import { connectToDatabase } from '../../../util/mongodb';

export default async function handler(req, res) {
  return exchangeToken(req.query.code)
    .then(async (data) => {
      const slackChannelId = req.query.state;
      // add athlete_id for indexing
      data.athlete_id = data.athlete.id;

      const { db } = await connectToDatabase();

      // Create index for the slack channel and strava athlete
      const indexData = { athlete_id: data.athlete_id, channel_id: slackChannelId };
      const query1 = indexData;
      const update1 = { $set: indexData };
      await db
        .collection('athlete-slack-channels')
        .updateOne(query1, update1, { upsert: true });
      
      // Save the strava token for later
      const query = { athlete_id: data.athlete_id };
      const update = { $set: data };
      await db
        .collection('tokens')
        .updateOne(query, update, { upsert: true })
        
      // msg slack
      await sendMessage({ channel: slackChannelId, message: `Athlete ${data.athlete.firstname} has joined the slack channel.` });

      // response
      res.statusCode = 200
      return res.json({ status: 'success', data: `Athlete ${data.athlete.firstname} has joined the slack channel.` });
    })
    .catch((error) => {
      res.statusCode = 401
      console.error(error);
      res.json('Token invalid');
    })
  // console.log(token)

  // save token

  // message slack

}
