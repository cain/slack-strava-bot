const { exchangeToken } = require('../../util/strava');

export default async function handler(req, res) {
  exchangeToken(req.query.code)
    .then((response) => {

      // save token in db

      // msg slack
      res.statusCode = 200
      res.json({ status: 'success' });
    })
    .catch(() => {
      res.statusCode = 401

      res.json('Token invalid');
    })
  // console.log(token)

  // save token

  // message slack

}
