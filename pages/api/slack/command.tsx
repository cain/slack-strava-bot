import { SlackCommand } from "../../../typscript/InterfaceSlack";
import { connectToDatabase } from '../../../util/mongodb'


export default async function handler (req, res) {
  if(req.method === 'POST') {
    console.log(req.body);

    const slackCommand: SlackCommand = req.body;

    const channelId = slackCommand.channel_id;
    const userId = slackCommand.user_id;
    const userName = slackCommand.user_name;

    const STRAVA_AUTH_URL = `https://www.strava.com/oauth/authorize?client_id=44322&response_type=code&redirect_uri=${process.env.WEB_URL}?&approval_prompt=force&scope=activity:read_all,activity:read&state=${channelId},${userId},${userName}`;

    // Return 200 first because slack gets grumpy if we take a while
    res.status(200).json({
      "response_type": "in_channel",
      "text": "🏃‍♀️ Click the link to add your Strava to this channel!" + STRAVA_AUTH_URL,
    });

    const { db } = await connectToDatabase();
    // Save it only once per channel so we dont flood db
    const query = { channel_id: slackCommand.channel_id };
    const update = { $set: slackCommand };
    await db
      .collection('slack-command')
      .updateOne(query, update, { upsert: true })

    return;
  }
}
