
const puppeteer = require('puppeteer');

export function generateMap({ polyline, id }: { polyline: string, id: number }) {
  return new Promise<{ path: string }>(async (res, rej) => {
    try {
      const browser = await puppeteer.launch();

      const page = await browser.newPage();
    
      await page.goto(`${process.env.WEB_URL}/generate-map?polyline=` + encodeURI(polyline));
      await page.setViewport({
        deviceScaleFactor: 2,
        height: 500,
        width: 800,
      });
      
      await page.waitForFunction('window.mapboxLoaded === true');
      const a = await page.$('#map')

      const path = `public/map/${id}.png`;
      await a.screenshot({ path: path });
    
      await browser.close();
      res({ path: path });
    } catch (error) {
      rej(error);
    }
  })
}