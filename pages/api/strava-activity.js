const { getActivity } = require('../../util/strava');

export default async function handler (req, res) {
  res.statusCode = 200

  const activity = await getActivity(5651244361);

  res.json({ activity });

}
