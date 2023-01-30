const userResolver = require("./user");
const postResolver = require("./post");
const boredResolver = require("./bored");

module.exports = [userResolver, postResolver, boredResolver];
