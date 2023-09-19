const { test, expect } = require("@jest/globals");

const { normalizeURL, getURLsFromHTML } = require("./crawl.js");

test("normailzes a URL", () => {
  expect(normalizeURL("https://blog.boot.dev/path/")).toBe(
    "blog.boot.dev/path"
  );
});

test("normailzes a URL", () => {
  expect(normalizeURL("http://blog.boot.dev/path")).toBe("blog.boot.dev/path");
});

test("find all links in html and return un-normalized", () => {
  expect(
    getURLsFromHTML(
      `<a href="/rxyz">Learn Backend Development</a>
      <p>having fun with testing</p>
      <a href="blog.boot.dev/foo">Go To Foo</a>`,
      "blog.boot.dev"
    )
  ).toStrictEqual(["blog.boot.dev/rxyz", "blog.boot.dev/foo"]);
});
