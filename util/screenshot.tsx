
const puppeteer = require('puppeteer');

export function generateMap({ polyline, id }: { polyline: string, id: number }) {
  return new Promise<{ path: string }>(async (res, rej) => {
    try {
      let chrome: any = {};
      const config = {
        headless: true,
      }
      let puppeteer;
      if (process.env.APP_ENV !== 'local') {
        // running on the Vercel platform.
        chrome = require('chrome-aws-lambda');
        puppeteer = require('puppeteer-core');
      } else {
        // running locally.
        puppeteer = require('puppeteer');
      }
      const browser = await puppeteer.launch({
        executablePath: await chrome.executablePath,
      });

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