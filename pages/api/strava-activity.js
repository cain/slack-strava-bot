const { getActivity } = require('../../util/strava');

export default async function handler (req, res) {
  res.statusCode = 200

  const activity = await getActivity(req.query.id, req.query.token);

  res.json({ activity });

}
