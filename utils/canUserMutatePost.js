const mongoose = require("mongoose");
const User = mongoose.model("users");
const PlacesToSeePost = mongoose.model("placesToSeePost");

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

  const post = await PlacesToSeePost.findOne({ postId });

  console.log(user._id);
  console.log(post._user._id);
  if (post?._user !== user._id) {
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
