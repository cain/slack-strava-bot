const { getActivity } = require('../../util/strava');

export default async function handler (req, res) {
  if(req.method === 'POST') {
    res.status(200).json('bip bop bap');
  }
}
