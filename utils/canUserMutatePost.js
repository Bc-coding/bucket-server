const mongoose = require("mongoose");
const User = mongoose.model("users");
const bucketList = mongoose.model("bucketList");

const canUserMutatePost = async ({ userInfo, postId }) => {
  const user = await User.findOne({ email: userInfo.email });

  if (!user) {
    return {
      userErrors: [
        {
          message: "User not found",
        },
      ],
      post: null,
    };
  }

  const post = await bucketList.findOne({ postId });

  // console.log(post?._user);
  // console.log(user._id);

  // using Mongo equals method to compare two objectIDs
  if (!post?._user.equals(user._id)) {
    return {
      userErrors: [
        {
          message: "Post not owned by the user",
        },
      ],
      post: null,
    };
  }
};

module.exports = canUserMutatePost;
