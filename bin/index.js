#!/usr/bin/env node

const commandLineArgs = require("command-line-args");
const fs = require("fs");
const path = require("path");
const { startDownload } = require("./download/start");
const { getInfos } = require("./infos/get");

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
const verbose = otherOptions.verbose;
const folder = otherOptions.folder || path.join(process.cwd(), otherOptions.id);

if (fs.existsSync(folder)) {
  verbose ? console.log("Deleting existing folder...") : "";
  let content = fs.readdirSync(folder);
  content.forEach((c) => {
    fs.unlinkSync(path.join(folder, c));
  });
  fs.rmdirSync(folder);
}

console.log("Starting Download of", otherOptions.id);

const mainUrl = `https://nhentai.net/g/${otherOptions.id}`;
verbose ? console.log("URL:", mainUrl) : "";

getInfos(mainUrl, otherOptions, (infos, folder_path) => {
  startDownload(infos?.gallery_id || process.exit(11), infos?.pages?.[0] || process.exit(12), folder_path, otherOptions);
});

process.on("beforeExit", () => {
  console.log("\n====================");
});
