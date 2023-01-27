const userTypeDefs = require("./user");

const postTypeDefs = require("./post");

const boredTypeDefs = require("./bored");

const typeDefs = `
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;

module.exports = [typeDefs, userTypeDefs, postTypeDefs, boredTypeDefs];
