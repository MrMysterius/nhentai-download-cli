const axios = require("axios").default;
const fs = require("fs");
const path = require("path");
const { extractInfos } = require("./extract");
const { writeInfo } = require("./write");

async function getInfos(url, options, next) {
  const res = await axios.get(url);
  if (res.status != 200) throw new Error("[E10] Couldn't get through to the site to get infos.");

  const data = await res.data;
  const infos = await extractInfos(data);
  infos.url = url;

  if (options.verbose) {
    for (let key of Object.keys(infos)) {
      console.log(`${key}: ${infos[`${key}`]}`);
    }
  }

  const folderPath = path.normalize(options.folder || path.join(process.cwd(), options.id.toString()));
  fs.mkdirSync(folderPath, { recursive: true });
  writeInfo(infos, path.join(folderPath, "ComicInfo.xml"));

  next(infos, folderPath);
}

module.exports.getInfos = getInfos;
