const DataURIParser = require("datauri/parser");
const path = require("path");

const getDataUri = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    throw new Error("File object is missing or invalid");
  }

  const parser = new DataURIParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

module.exports = { getDataUri };
