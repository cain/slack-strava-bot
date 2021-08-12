
interface SlackCommand {
  token: string;
  team_id: string;
  team_domain: string;
  enterprise_id: string | null;
  enterprise_name: string | null;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
  api_app_id: string;
}

export default async function handler (req, res) {
  if(req.method === 'POST') {
    console.log(req.body);

    const slackCommand: SlackCommand = req.body;

    console.log(slackCommand.text);

    res.status(200).json('bip bop bap');
    return;
  }
}
