// Getting data from database
const PlacesToSeePost = require("../../database/models/PlacesToSeePost");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Post = mongoose.model("placesToSeePost");
const canUserMutatePost = require("../../utils/canUserMutatePost");
const uuid = require("uuid");

module.exports = {
  Query: {
    postPlacesToSee: async (_, { input }) => {
      try {
        // checking database if the user exists
        const post = await Post.findOne({ postId: input.postId });
        if (!post) {
          throw new Error("Post not found!");
        }
        return post;
      } catch (error) {
        console.log(error);
      }
    },
    postsPlacesToSee: async () => {
      try {
        // checking database if the users exists
        const posts = await Post.find();
        if (!posts) {
          throw new Error("Posts not found!");
        }
        return posts;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    createPlacesToSee: async (_, { input }, { userInfo }) => {
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

        const newPost = new PlacesToSeePost({
          ...input,
          postId: postId,
          _user: user.id,
        });

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

    updatePlacesToSee: async (_, { input }, { userInfo }) => {
      console.log(userInfo);
      console.log(input);
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
        postId: input.postId,
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

      // const existingPost = await prisma.post.findUnique({
      //   where: {
      //     id: Number(postId),
      //   },
      // });

      // if (!existingPost) {
      //   return {
      //     userErrors: [
      //       {
      //         message: "Post does not exist",
      //       },
      //     ],
      //     post: null,
      //   };
      // }

      // let payloadToUpdate = {
      //   title,
      //   content,
      // };

      // if (!title) delete payloadToUpdate.title;
      // if (!content) delete payloadToUpdate.content;

      // return {
      //   userErrors: [],
      //   post: prisma.post.update({
      //     data: {
      //       ...payloadToUpdate,
      //     },
      //     where: {
      //       id: Number(postId),
      //     },
      //   }),
      // };
    },
  },
};
