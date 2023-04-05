// Getting data from database
const BucketList = require("../../database/models/BucketList");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Post = mongoose.model("bucketList");
const canUserMutatePost = require("../../utils/canUserMutatePost");
const uuid = require("uuid");

module.exports = {
  Query: {
    // get a post from bucket list by its postId
    getPostBucketList: async (_, { input }, { userInfo }) => {
      try {
        // Check if the user is logged in
        if (!userInfo) {
          return {
            userErrors: [
              {
                message: "Forbidden access",
              },
            ],
            post: null,
          };
        }

        const post = await Post.findOne({ _id: input.postId })
          .populate("_user")
          .exec();

        // console.log(post);

        if (!post) {
          return {
            userErrors: [
              {
                message: "Post not found",
              },
            ],
            post: null,
          };
        }
        return {
          userErrors: [],
          post: post,
        };
      } catch (error) {
        console.log(error);
      }
    },
    readAllBucketList: async (_, __, { userInfo }) => {
      if (!userInfo) {
        return {
          userErrors: [
            {
              message: "Forbidden access",
            },
          ],
          post: null,
        };
      }

      const user = await User.findOne({ email: userInfo.email });

      const filter = {
        _user: user._id,
      };

      const existingPosts = await Post.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
      ]);

      if (!existingPosts) {
        return {
          userErrors: [
            {
              message: "Posts do not exist",
            },
          ],
          post: null,
        };
      }

      existingPosts.map(item => {
        // Formatting the response
        item.id = item._id.toString();
        item.userId = item._user.toString();
      });

      return {
        userErrors: [],
        posts: existingPosts,
      };
    },
  },

  Mutation: {
    createBucketList: async (_, { input }, { userInfo }) => {
      try {
        // creating a new instance of the post model
        if (!userInfo) {
          return {
            userErrors: [
              {
                message: "Forbidden access",
              },
            ],
            post: null,
          };
        }

        const user = await User.findOne({ email: userInfo.email });

        const { title, category, desc } = input;
        if (!title || !category || !desc) {
          return {
            userErrors: [
              {
                message:
                  "you must provide a place, a location and description to create a post",
              },
            ],
            post: null,
          };
        }

        const postId = uuid.v4();

        const newPost = new BucketList({
          ...input,
          postId: postId,
          _user: user.id,
        });

        //     _user: {
        //   id: user.id,
        //   userId: user.userId,
        // },

        await newPost.save();

        // update the user with posts
        const update = { posts: [...user.posts, newPost._id] };
        await User.findOneAndUpdate(user.id, update, {
          new: true,
        });
        // populate the post with the user's info
        const post = await Post.findOne({ postId: postId })
          .populate("_user")
          .exec();

        return {
          userErrors: [],
          post: post,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    updateBucketList: async (_, { input }, { userInfo }) => {
      const { postId, post } = input;
      // console.log(userInfo);
      // console.log(input);
      if (!userInfo) {
        return {
          userErrors: [
            {
              message: "Forbidden access",
            },
          ],
          post: null,
        };
      }

      const error = await canUserMutatePost({
        userInfo,
        postId: postId,
      });

      if (error) return error;

      const existingPost = await Post.findOne({
        _id: postId,
      });

      // console.log(existingPost);

      if (!existingPost) {
        return {
          userErrors: [
            {
              message: "Post does not exist",
            },
          ],
          post: null,
        };
      }

      // update the user with posts
      const payloadToUpdate = { ...post };

      const newPost = await Post.findOneAndUpdate(
        existingPost._id,
        payloadToUpdate,
        {
          new: true,
        }
      )
        .populate("_user")
        .exec();

      // console.log(newPost);

      return {
        userErrors: [],
        post: newPost,
      };
    },
    deleteBucketList: async (_, { input }, { userInfo }) => {
      const { postId } = input;
      // console.log(userInfo);
      // console.log(input);
      if (!userInfo) {
        return {
          userErrors: [
            {
              message: "Forbidden access",
            },
          ],
          post: null,
        };
      }

      const error = await canUserMutatePost({
        userInfo,
        postId: postId,
      });

      if (error) return error;

      const existingPost = await Post.findOne({
        _id: postId,
      });

      // console.log(existingPost);

      if (!existingPost) {
        return {
          userErrors: [
            {
              message: "Post does not exist",
            },
          ],
          post: null,
        };
      }

      const deletedPost = await Post.findOneAndDelete(existingPost._id)
        .populate("_user")
        .exec();

      // console.log(deletedPost);

      return {
        userErrors: [],
        post: deletedPost,
      };
    },
  },
};
