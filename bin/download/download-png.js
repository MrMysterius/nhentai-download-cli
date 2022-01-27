const fs = require("fs");
const path = require("path");
const https = require("https");

async function download_png(url, folder_path, image_number, resolve, reject) {
  const file_path = path.join(folder_path, `${image_number}.png`);
  let file = fs.createWriteStream(file_path);

  https.get(`${url}.png`, (res) => {
    res.pipe(file);

    res.on("data", () => {
      process.stdout.write(`\r${image_number} ◌`);
    });

    res.on("end", () => {
      file.close();
      process.stdout.write(`\r${image_number} ● ${url}.png`);
      console.log("");
      resolve();
    });

    res.on("error", (err) => {
      fs.rmSync(file_path);
      file.close();
      reject();
      throw new Error(`Error downloading ${url}.png`);
    });
  });
}

module.exports.download_png = download_png;
