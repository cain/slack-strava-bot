
const puppeteer = require('puppeteer');

export default async (req, res) => {
  console.log(req.method)
  if(req.method === 'GET') {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto('http://localhost:3000/');
    await page.setViewport({
      deviceScaleFactor: 2,
      height: 500,
      width: 800,
    });
    
    await page.waitForFunction('window.mapboxLoaded === true');
    // await page.screenshot({ path: 'public/map/example1.png' });
    const a = await page.$('#map')
    await a.screenshot({ path: 'public/map/example1.png' });

    await browser.close();
    res.json('screenshot done.')
  } else if(req.method === 'POST') {
    //
  }
};