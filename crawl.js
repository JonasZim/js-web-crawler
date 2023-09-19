const { JSDOM } = require("jsdom");

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.length > 0 && fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aElements = dom.window.document.querySelectorAll("a");
  for (const aElement of aElements) {
    if (aElement.href.slice(0, 1) === "/") {
      try {
        urls.push(new URL(aElement.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href);
      } catch (err) {
        console.log(`${err.message}: ${aElement.href}`);
      }
    }
  }
  return urls;
}

const getPageContent = async (currentURL) => {
  const response = await fetch(currentURL, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "text/html",
    },
  });

  const body = await response.text();
  const urlObj = new URL(currentURL);
  const urls = getURLsFromHTML(body, urlObj.hostname);

  return urls;
};

const crawlPage = async (baseURL, currentURL, pages = {}) => {
  const cur = new URL(currentURL);
  const base = new URL(baseURL);
  if (cur.hostname !== base.hostname) {
    return pages;
  }
  const normalizedCur = normalizeURL(currentURL);
  if (pages[normalizedCur]) {
    pages[normalizedCur] += 1;
    return pages;
  } else {
    if (normalizedCur === normalizeURL(baseURL)) {
      pages[normalizedCur] = 0;
    } else {
      pages[normalizedCur] = 1;
    }
  }

  const response = await fetch(currentURL, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "text/html",
    },
  });
  if (response.status >= 400) {
    console.log(response.status);
    return;
  } else if (!response.headers.get("content-type").includes("text/html")) {
    console.log(response.headers.get("content-type"));
    return;
  } else {
    const body = await response.text();
    const urls = getURLsFromHTML(body, base.hostname);
    for (let url of urls) {
      const normalizeThatShit = normalizeURL(url);
      crawlPage(baseURL, normalizeThatShit, pages);
    }
  }
  return pages;
};

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
  getPageContent,
};
