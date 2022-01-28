const { download } = require("./download");

async function startDownload(id, page_count, folder_path, options) {
  const base_url = `https://i.nhentai.net/galleries/${id}`;

  const promises = [];

  for (let i = 0; i < page_count; i++) {
    promises.push(download(`${base_url}/${i + 1}`, folder_path, i + 1, i * 300));
  }

  await Promise.all(promises);
}

module.exports.startDownload = startDownload;
