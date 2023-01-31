module.exports = `
 extend type Query {
    activity: activityPayload!
    activityByType(input: typeInput): activityPayload!
  }  

  type activityPayload {
    activity: String
    accessibility: String
    type: String
    participants:  String
    price: String
    link: String
    key: String
  }

  input typeInput {
    type: String!
  }
`;
