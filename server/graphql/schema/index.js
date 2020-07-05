const fs = require("fs");
const { buildSchema } = require("graphql");

const schema = fs
    .readFileSync(`${__dirname}/../schema.graphql`, "utf8")
    .toString();

module.exports = buildSchema(schema);