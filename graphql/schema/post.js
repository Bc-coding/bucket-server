module.exports = `
 extend type Query {
    postBucketList(input: postIdInput):  BucketListPostPayload!
    postsBucketList: [BucketListPostPayload!]!
  }
extend type Mutation {
    createBucketList(input: bucketListCreateInput):BucketListPostPayload!
    updateBucketList(input: bucketListUpdateInput):BucketListPostPayload!
  }

  type BucketListPostPayload {
    userErrors: [UserError!]
    post: BucketListPost
  }

  type UserError {
    message: String!
  }

  type BucketListPost {
    id: ID!
    postId: String!
    title: String!
    category: String!
    desc: String!
    location: String
    completed: Boolean
    date: String
    memo: String
    createdAt: String!
    updatedAt: String!
    _user: User
  }

  type User {
    userId: String!
    name: String!
    email: String!
    # posts: [Post!]
  }

  input bucketListCreateInput {
    title: String!
    category: String!
    desc: String!
    location: String
    completed: Boolean
    date: String
    memo: String
  }

  input bucketListUpdateInput {
    postId: String!
    post: bucketListCreateInput!
  }

  input postIdInput {
    postId: String!
  }
`;
