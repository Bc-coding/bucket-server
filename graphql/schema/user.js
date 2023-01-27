module.exports = `
  extend type Query {
    user(input: emailInput): User!
    users: [User!]!
  }

  extend type Mutation {
    signup(input: signupInput):User
    login(input: loginInput): Token
  }

  ###### TYPE ######
  type User {
    id: ID!
    userId: String!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Token {
    token: String!
  }

  ###### INPUT #####
  input signupInput {
    name: String!
    email: String!
    password: String!
  }

  input loginInput {
    email: String!
    password: String!
  }

  input emailInput {
    email: String!
  }
`;
