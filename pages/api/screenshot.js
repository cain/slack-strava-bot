import { generateMap } from '../../functions/screenshot.tsx'

export default async function handler (req, res) {
  console.log(req.method)
  if(req.method === 'GET') {
    await generateMap();
    return res.status(200).json('screenshot done.')
  } else if(req.method === 'POST') {
    //
  }
};