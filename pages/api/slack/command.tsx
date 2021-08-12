import { SlackCommand } from "../../../typscript/InterfaceSlack";

export default async function handler (req, res) {
  if(req.method === 'POST') {
    console.log(req.body);

    const slackCommand: SlackCommand = req.body;

    console.log(slackCommand.text);

    res.status(200).json({
      "response_type": "in_channel",
      "text": "Slack bot has added to the channel!"
    });
    return;
  }
}
