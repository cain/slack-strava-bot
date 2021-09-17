import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../util/mongodb'
import { getAuthToken } from '../../../util/slack';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET' && req.query.code) {
    const { db } = await connectToDatabase();

    const code = `${req.query.code}`;

    const token = await getAuthToken(code, process.env.WEB_URL || 'https://slack-strava-bot.vercel.app/');

    res.status(200).json(token);

    // const query = { channel_id: slackCommand.channel_id };
    // const update = { $set: slackCommand };
    // await db
    //   .collection('slack-auth')
    //   .updateOne(query, update, { upsert: true })
    return;
  }
}

