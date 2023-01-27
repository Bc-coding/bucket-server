module.exports = {
  Query: {
    activity: (_, __, { boredAPI }) => {
      return boredAPI.getActivity();
    },
    activityByType: (_, { input }, { boredAPI }) => {
      return boredAPI.getActivityByType(input.type);
    },
  },
};
