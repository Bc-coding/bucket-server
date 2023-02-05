module.exports = `
  extend type Query {
    user(input: emailInput): UserPayload!
    users: [User!]!
  }

  extend type Mutation {
    signup(input: signupInput): SingupPayload!
    login(input: loginInput): LoginPayload!
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

  type UserPayload {
    userErrors: [UserError]!
    user: User
  }

  type SingupPayload {
    userErrors: [UserError]!
    user: User
  }

  type LoginPayload {
    userErrors: [UserError]!
    token: String
    user: User
  }


   type UserError {
    message: String!
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
