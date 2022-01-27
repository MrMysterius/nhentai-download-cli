const fs = require("fs");

async function writeInfo(infos, filepath) {
  const data = `<?xml version="1.0"?>
  <ComicInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <Title>${infos.title.pretty}</Title>
    <Series>${infos.title.pretty}</Series>
    <Number>1</Number>
    <Volume>1</Volume>
    <Notes>Metadata Scrapped from nHentai - Not Perfect</Notes>
    <Writer>${infos.artists.join(", ")}</Writer>
    <Genre>${infos.tags.join(", ")}</Genre>
    <Web>${infos.url}</Web>
    <PageCount>${infos.pages[0]}</PageCount>
    <AgeRating>Adults Only 18+</AgeRating>
    <Characters>${infos.characters.join(", ")}</Characters>
    <Pages />
  </ComicInfo>`;

  fs.writeFileSync(filepath, data, { encoding: "utf8" });
}

module.exports.writeInfo = writeInfo;
