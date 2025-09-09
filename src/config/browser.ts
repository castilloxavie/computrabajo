import puppeteer, { Browser } from 'puppeteer';

export const launchOptions = {
  headless: false, 
  defaultViewport: null,
  args: [
        "--start-maximized" ,
        "--disable-notifications",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
       
  ],
   ignoreHTTPSErrors: true
};

export async function createBrowser(): Promise<Browser> {
  return await puppeteer.launch(launchOptions);
}
