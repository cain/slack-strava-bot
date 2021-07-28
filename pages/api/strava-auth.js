const { exchangeToken } = require('../../util/strava');
const { sendMessage } = require('../../util/slack');

export default async function handler(req, res) {
  return exchangeToken(req.query.code)
    .then(async (data) => {

      // save token in db

      // msg slack
      await sendMessage({ message: `Athlete ${data.athlete.firstname} has joined the slack channel.` });
      // console.log(data);

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
