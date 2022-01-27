const fs = require("fs");
const path = require("path");
const https = require("https");
const { download_png } = require("./download-png");
const { download_jpeg } = require("./download-jpeg");

async function download(url, folder_path, image_number, delay = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      https.get(`${url}.jpg`, (res) => {
        switch (res.headers["content-type"]) {
          case "image/jpeg":
            download_jpeg(url, folder_path, image_number, resolve, reject);
            return;
          default:
            download_png(url, folder_path, image_number, resolve, reject);
            return;
        }
      });
    }, delay);
  });
}

module.exports.download = download;
