const { getAthleteToken, refreshToken } = require('../../../util/strava');

export default async function handler (req, res) {
  res.statusCode = 200

  const token = await getAthleteToken(req.query.id);
  const newToken = await refreshToken(token);

  res.json({ newToken });

}
