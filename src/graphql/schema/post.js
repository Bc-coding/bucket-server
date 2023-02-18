module.exports = `
 extend type Query {
    getPostBucketList(input: PostIdInput):  BucketListPostPayload!
    readAllBucketList: AllBucketListPostPayload
  }
extend type Mutation {
    createBucketList(input: BucketListCreateInput):BucketListPostPayload!
    updateBucketList(input: BucketListUpdateInput):BucketListPostPayload!
    deleteBucketList(input: PostIdInput): BucketListPostPayload!
  }

  type BucketListPostPayload {
    userErrors: [UserError!]!
    post: BucketListPost
  }

  type AllBucketListPostPayload {
    userErrors: [UserError]!
    posts: [BucketListPostNew!]
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
    emoji: String
    createdAt: String!
    updatedAt: String!
    _user: User
  }

    type BucketListPostNew {
    id: String
    postId: String!
    title: String!
    category: String!
    desc: String!
    location: String
    completed: Boolean
    date: String
    memo: String
    emoji: String
    createdAt: String!
    updatedAt: String!
    userId: ID
  }

  type User {
    userId: String!
    name: String!
    email: String!
    # posts: [Post!]
  }

  input BucketListCreateInput {
    title: String!
    category: String!
    desc: String!
    location: String
    completed: Boolean
    date: String
    memo: String
    emoji: String
  }

  input BucketListUpdateInputPost {
    title: String
    category: String
    desc: String
    location: String
    completed: Boolean
    date: String
    memo: String
    emoji: String
  }

  input BucketListUpdateInput {
    postId: String!
    post: BucketListUpdateInputPost!
  }



  input PostIdInput {
    postId: String!
  }
`;
