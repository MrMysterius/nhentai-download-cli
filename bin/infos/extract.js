const cheerio = require("cheerio");
const { after } = require("cheerio/lib/api/manipulation");

async function extractInfos(data) {
  const $ = cheerio.load(data);

  const details = {
    title: {
      before: $("h1.title > .before")?.[0]?.children?.[0]?.data,
      pretty: $("h1.title > .pretty")?.[0]?.children?.[0]?.data,
      after: $("h1.title > .after")?.[0]?.children?.[0]?.data,
    },
    gallery_id: undefined,
  };

  const gallery_id = $("#thumbnail-container .thumbs")[0].children?.[0]?.children?.[0]?.children?.[0]?.attribs["data-src"].match(
    /https:\/\/t[2-9]{0,1}.nhentai.net\/galleries\/(\d+)/
  )?.[1];
  details.gallery_id = gallery_id;

  const tag_containers = await $("section#tags").children(".tag-container");

  for (let container of tag_containers) {
    const key = container.children[0].data.match(/\w+/)?.[0].toLowerCase();
    details[`${key}`] = [];

    const nodes = container.children[1].children;

    for (let node of nodes) {
      const name = node.children.find((v) => v?.attribs?.class == "name");
      let value = name?.children?.[0]?.data;

      if (!value) continue;
      details[`${key}`].push(value.replace("&", "&amp;"));
    }
  }

  return details;
}

module.exports.extractInfos = extractInfos;
