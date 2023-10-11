const csv = require("csvtojson");
const fs = require("fs");

module.exports.csvToJson = async () => {
  try {
    const stream = fs.createReadStream("utils/books.csv");
    const json = await csv().fromStream(stream);
    return json;
  } catch (error) {
    return null;
  }
};
