module.exports = `
 extend type Query {
    activity: activityPayload!
    activityByType(input: typeInput): activityPayload!
  }  

  type activityPayload {
    activity: String
    accessibility: String
    type: String
    participants: Int
    price: Int
    link: String
    key: String
  }

  input typeInput {
    type: String!
  }
`;
