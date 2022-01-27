#!/usr/bin/env node

const cheerio = require("cheerio");
const commandLineArgs = require("command-line-args");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const https = require("https");

const options = commandLineArgs(require("./options"), { stopAtFirstUnknown: true });
const argv = options._unknown || [];

let otherOptions;
switch (options.command) {
  case "download":
    try {
      otherOptions = commandLineArgs(require("./otherOptions.js"), { argv });
    } catch {
      console.log("Error: Invalid Arguments");
      process.exit(2);
    }
    break;
  default:
    console.log("Error: No Arguments");
    process.exit(1);
}

console.log("====================\nnHentai Download CLI\nby MrMysterius\n====================");
if (!otherOptions.id) {
  console.error("Error: ");
  process.exit(2);
}
const v = otherOptions.verbose;
const f = otherOptions.folder || path.join(process.cwd(), otherOptions.id);
if (fs.existsSync(f)) {
  v ? console.log("Deleting existing folder...") : "";
  let content = fs.readdirSync(f);
  content.forEach((c) => {
    fs.unlinkSync(path.join(f, c));
  });
  fs.rmdirSync(f);
}
console.log("Starting Download of", otherOptions.id);

const mainUrl = `https://nhentai.net/g/${otherOptions.id}`;
v ? console.log("URL:", mainUrl) : "";

let downloaded = 0;
let amountOfPages = 0;
let intervalId = -1;

async function downloadPicture(url, filename, folder) {
  let isJpg = false;
  https.get(url + ".jpg", (res) => {
    if (res.headers["content-type"].includes("image/jpeg")) isJpg = true;

    res.on("data", (c) => {});

    res.on("end", () => {
      if (isJpg) {
        let file = fs.createWriteStream(path.join(folder, filename + ".jpg"));
        https.get(url + ".jpg", (res) => {
          res.pipe(file);

          res.on("end", () => {
            v ? console.log("\rDownloaded:", url, "| Saved to:", path.join(folder, filename + ".jpg")) : "";
            downloaded++;
          });

          res.on("error", () => {
            console.error("ERROR: Couldn't download / Save", url);
            downloaded++;
          });
        });
      } else {
        let file = fs.createWriteStream(path.join(folder, filename + ".png"));
        https.get(url + ".png", (res) => {
          res.pipe(file);

          res.on("end", () => {
            v ? console.log("\rDownloaded:", url, "| Saved to:", path.join(folder, filename + ".png")) : "";
            downloaded++;
          });

          res.on("error", () => {
            console.error("ERROR: Couldn't download / Save", url);
            downloaded++;
          });
        });
      }
    });
  });
}

fetch(mainUrl)
  .then((res) => res.text())
  .then((body) => {
    const $ = cheerio.load(body);
    const info = {};

    const pages = $(".thumbs .thumb-container").toArray();
    amountOfPages = pages.length;

    const galleryID = pages[0].children[0].children[0].attribs["data-src"].match(new RegExp("(?<=https:\\/\\/t.nhentai.net\\/galleries\\/)\\d+"))[0];

    v ? console.log("Title:", $("title").text()) : "";
    info.title = $("title").text();
    v ? console.log("Pages:", amountOfPages) : "";
    info.pages = amountOfPages;
    v ? console.log("Gallery ID:", galleryID) : "";
    info.gallery_id = galleryID;
    fs.mkdirSync(f);

    console.log("Downloading...");
    for (let i = 0; i < amountOfPages; i++) {
      let url = `https://i.nhentai.net/galleries/${galleryID}/${i + 1}`;
      setTimeout(() => {
        downloadPicture(url, `${i + 1}`, f);
      }, i * 300);
    }

    intervalId = setInterval(() => {
      process.stdout.write(`\r${downloaded} / ${amountOfPages}`);
      if (downloaded >= amountOfPages) clearInterval(intervalId);
    }, 50);
  });

process.on("beforeExit", () => {
  console.log("\n====================");
});
