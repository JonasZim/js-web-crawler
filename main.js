const { crawlPage, getPageContent, normalizeURL } = require("./crawl.js");
const { argv, exit } = require("node:process");

async function main() {
  if (argv.length < 3 || argv.length > 3) {
    console.log("error");
    exit();
  } else {
    const baseURL = argv[2];
    console.log(`Starting to crawl the internet from this adress: ${baseURL}`);
    const pages = await crawlPage(baseURL, baseURL);
    console.log(pages);
  }
}

async function testing() {
  if (argv.length < 3 || argv.length > 3) {
    console.log("error");
    exit();
  } else {
    const baseURL = argv[2];
    console.log(`Starting to crawl the internet from this adress: ${baseURL}`);
    const links = await getPageContent(baseURL);
    const urlObj = new URL(baseURL);
    console.log(urlObj.href, urlObj.origin);
    console.log(links);
  }
}

testing();
