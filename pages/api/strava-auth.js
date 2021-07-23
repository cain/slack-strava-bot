const { exchangeToken } = require('../../util/strava');
const { sendMessage } = require('../../util/slack');

export default async function handler(req, res) {
  exchangeToken(req.query.code)
    .then(async(response) => {

      // save token in db

      // msg slack
      await sendMessage({ message: response });
      console.log(response);

      // response
      res.statusCode = 200
      res.json({ status: 'success', data: response.data });
    })
    .catch(() => {
      res.statusCode = 401

      res.json('Token invalid');
    })
  // console.log(token)

  // save token

  // message slack

}
