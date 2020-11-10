const puppeteer = require('puppeteer');

exports.quoteByAI = async function () {

  try{
  const browser = await puppeteer.launch({"headless": true}); 
  const page = await browser.newPage();
  await page.goto('https://www.inspirobot.me/');
  console.log("Website Loaded!");
  const genBtn = await page.$(".btn-generate");
  console.log("Element loaded");
  await genBtn.evaluate(genBtn => genBtn.click());
  //document.querySelector('.btn-generate').click();
  console.log("Generating Image!");
  await page.waitForSelector('.generated-image', {
  visible: true,
  });
  let quote_Images = await page.$$eval('.generated-image', imgs => imgs.map(img => img.getAttribute('src')));
  //let image_Url = await document.querySelector(".generated-image").src;
  let image_Url = quote_Images.toString()
  console.log("Grabbed image!");
  console.log("URL:" + image_Url);
  return image_Url;
  //await browser.close() //Comment out this line to keep it running 

  }catch(err) {
    console.log(err);
  }
  

}