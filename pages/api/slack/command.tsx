import { SlackCommand } from "../../../typscript/InterfaceSlack";
import { connectToDatabase } from '../../../util/mongodb'


export default async function handler (req, res) {
  if(req.method === 'POST') {
    console.log(req.body);

    const teamId = req.body.channel_id;

    const slackCommand: SlackCommand = req.body;

    const STRAVA_AUTH_URL = `https://www.strava.com/oauth/authorize?client_id=44322&response_type=code&redirect_uri=${process.env.WEB_URL}?&approval_prompt=force&scope=activity:read_all,activity:read&state=${teamId}`;

    // Return 200 first because slack gets grumpy if we take a while
    res.status(200).json({
      "response_type": "in_channel",
      "text": "Slack bot has added to the channel! " + STRAVA_AUTH_URL,
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
