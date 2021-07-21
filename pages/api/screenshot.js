import { generateMap } from '../../functions/screenshot'

export default async (req, res) => {
  console.log(req.method)
  if(req.method === 'GET') {
    await generateMap();
    res.json('screenshot done.')
  } else if(req.method === 'POST') {
    //
  }
};