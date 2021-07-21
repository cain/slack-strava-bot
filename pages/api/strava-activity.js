const { getActivity } = require('../../util/strava');

export default async (req, res) => {
  res.statusCode = 200

  const activity = await getActivity();

  res.json({ activity });

}
