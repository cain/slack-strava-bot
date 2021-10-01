
import chromium from 'chrome-aws-lambda'
import AWS from 'aws-sdk'

// const path = require('path');

const S3 = new AWS.S3({
	credentials: {
		accessKeyId: process.env.AWS_S3_ACCESS_KEY,
		secretAccessKey: process.env.AWS_S3_SECRET,
	}
})


// https://github.com/mehulmpt/nextjs-puppeteer-aws-s3-screenshot-service/blob/main/api/get-screenshot-image.js
async function getBrowserInstance() {
  console.log('getBrowserInstance')

	const executablePath = await chromium.executablePath

	if (!executablePath) {
		// running locally
		const puppeteer = require('puppeteer')
		return puppeteer.launch({
			args: chromium.args,
			headless: true,
			ignoreHTTPSErrors: true
		})
	}

	return chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
}
// 87pSozfHW7XgSpykte65jFhBbh8n8ze3pcnCMghjYTfocScb8TauVYXNeCUxouyPefKWx4uRD9ufTEsSxUoqyE4MMFo11oJ
export function generateMap({ polyline, id }: { polyline: string, id: number }) {
  let browser = null
  return new Promise<{ path: string }>(async (res, rej) => {
    try {
      // let chrome: any = {};
      // const config = {
      //   headless: true,
      // }
      // let puppeteer;
      // if (process.env.APP_ENV !== 'local') {
      //   // running on the Vercel platform.
      //   chrome = require('chrome-aws-lambda');
      //   puppeteer = require('puppeteer-core');
      // } else {
      //   // running locally.
      //   puppeteer = require('puppeteer');
      // }
      // const browser = await puppeteer.launch({
      //   args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
      //   executablePath: await chrome.executablePath,
      // });
      console.log('try catch')

      // browser = await getBrowserInstance()
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
      console.log('init instance')
      const page = await browser.newPage();
    
      await page.goto(`${process.env.WEB_URL}/generate-map?polyline=` + encodeURI(polyline));
      console.log('went to page')

      // console.log('title: ' + page.title())

      await page.setViewport({
        deviceScaleFactor: 2,
        height: 500,
        width: 800,
      });
      
      await page.waitForFunction('window.mapboxLoaded === true');
      const a = await page.$('#map')

      // const path = `public/map/${id}.png`;
      const imageBuffer = await a.screenshot();
      const fileName = 'map_' + id + '.jpg';

      const uploadOptions = {
        Bucket: 'strava-slack-bot',
        Key: fileName,
        Body: imageBuffer
      }

      S3.upload(uploadOptions, (error, data) => {
        if(error) {
          // handle error
          console.error(error);
        }
        const params = {
          Bucket: 'strava-slack-bot',
          Key: fileName,
          Expires: 60
        }

        const signedURL = S3.getSignedUrl('getObject', params)

        res({ path: signedURL });
      })
    
      await browser.close();
      console.log('close browser')

    } catch (error) {
      if(browser && browser.close) {
        await browser.close();
      }
      rej(error);
    }
  })
}