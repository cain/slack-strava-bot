import { exchangeToken } from'../../util/strava.tsx';
const { sendMessage } = require('../../util/slack');
import { connectToDatabase } from '../../util/mongodb'

export default async function handler(req, res) {
  return exchangeToken(req.query.code)
    .then(async (data) => {

      // save token in db
      data.athlete_id = data.athlete.id;
      const { db } = await connectToDatabase();
      const query = { athlete_id: data.athlete_id };
      const update = { $set: data };
      await db
        .collection('tokens').updateOne(query, update, { upsert: true })

      // msg slack
      await sendMessage({ message: `Athlete ${data.athlete.firstname} has joined the slack channel.` });

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
