const { download } = require("./download");
const _7z = require("7zip-min");
const path = require("path");
const fs = require("fs");

async function startDownload(id, page_count, folder_path, options) {
  const base_url = `https://i.nhentai.net/galleries/${id}`;

  const promises = [];

  for (let i = 0; i < page_count; i++) {
    promises.push(download(`${base_url}/${i + 1}`, folder_path, i + 1, i * 300));
  }

  await Promise.all(promises);

  if (!options.compress) return;

  _7z.pack(folder_path, path.join(process.cwd(), `${options.id}.7z`), (err) => {
    if (err) throw err;
    fs.renameSync(path.join(process.cwd(), `${options.id}.7z`), path.join(process.cwd(), `${options.id}.cb7`));
    fs.rm(folder_path, { recursive: true });
  });
}

module.exports.startDownload = startDownload;
