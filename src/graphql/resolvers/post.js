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
    getPostBucketList: async (_, { input }) => {
      try {
        // checking database if the user exists

        const post = await Post.findOne({ postId: input.postId })
          .populate("_user")
          .exec();

        if (!post) {
          throw new Error("Post not found!");
        }
        return {
          userErrors: [
            {
              message: "null",
            },
          ],
          post: post,
        };
      } catch (error) {
        console.log(error);
      }
    },
    getPostsBucketList: async () => {
      try {
        // get a list of posts from database
        const posts = await Post.find().populate("_user").exec();

        if (!posts) {
          throw new Error("Posts not found!");
        }
        // Formatting the result in accordance with the schema [postsBuckletListPayload!]!
        const newPosts = posts.map(post => {
          return {
            userErrors: [
              {
                message: "null",
              },
            ],
            post: post,
          };
        });

        return newPosts;
      } catch (error) {
        console.log(error);
      }
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

      const { title, category, desc } = post;
      if (!title && !category && !desc) {
        return {
          userErrors: [
            {
              message:
                "you must provide either a title, category and description to update a post",
            },
          ],
          post: null,
        };
      }

      const existingPost = await Post.findOne({
        _id: postId,
      });

      console.log(existingPost);

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

      console.log(newPost);

      return {
        userErrors: [],
        post: newPost,
      };
    },
  },
};
