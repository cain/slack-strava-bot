import { SlackCommand } from "../../../typscript/InterfaceSlack";
import { connectToDatabase } from '../../../util/mongodb'


export default async function handler (req, res) {
  if(req.method === 'POST') {
    const { db } = await connectToDatabase();
    console.log(req.body);

    const slackCommand: SlackCommand = req.body;

    console.log(slackCommand.text);

    res.status(200).json({
      "response_type": "in_channel",
      "text": "Slack bot has added to the channel!"
    });

    const query = { channel_id: slackCommand.channel_id };
    const update = { $set: slackCommand };
    await db
      .collection('slack-command')
      .updateOne(query, update, { upsert: true })
    return;
  }
}
