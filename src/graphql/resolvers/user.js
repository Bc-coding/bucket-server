const { combineResolvers } = require("graphql-resolvers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const keys = require("../../config/keys");
const uuid = require("uuid");

// Getting data from database
const User = require("../../database/models/user");
// const User = mongoose.model("users");

module.exports = {
  Query: {
    user: async (_, { input }) => {
      try {
        // checking database if the user exists
        const user = await User.findOne({ email: input.email });
        if (!user) {
          // throw new Error("User not found!");

          return {
            userErrors: [
              {
                message: "User not found!",
              },
            ],
            user: null,
          };
        }

        return {
          userErrors: [],
          user: user,
        };
      } catch (error) {
        console.log(error);
      }
    },
    users: async () => {
      try {
        // checking database if the users exists
        const users = await User.find();
        if (!users) {
          throw new Error("Users not found!");
        }
        return users;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    signup: async (_, { input }) => {
      try {
        // first, we need to check if the user has already email to avoid duplication.

        const user = await User.findOne({ email: input.email });
        if (user) {
          // throw new Error("Email already in use");
          return {
            userErrors: [
              {
                message: "Email already in use",
              },
            ],
            user: null,
          };
        }
        const hashedPassword = await bcrypt.hash(input.password, 12);
        // creating a new instance of the user model
        // then overwrite the password with hashed password
        const newUser = new User({
          ...input,
          password: hashedPassword,
          userId: uuid.v4(),
        });
        const result = await newUser.save();

        return {
          userErrors: [],
          user: result,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          // throw new Error("User not found");
          return {
            userErrors: [
              {
                message: "User not found",
              },
            ],
            token: null,
            user: null,
          };
        }
        const isPasswordValid = await bcrypt.compare(
          input.password,
          user.password
        );

        if (!isPasswordValid) {
          // throw new Error("Incorrect Password");
          return {
            userErrors: [
              {
                message: "Incorrect Password",
              },
            ],
            token: null,
            user: null,
          };
        }

        const secret = keys.jwtSinganiture;

        // const token = jwt.sign({ email: user.email }, "password", {
        //   expiresIn: "1d",
        // });

        const token = jwt.sign({ email: user.email }, secret);

        return {
          userErrors: [],
          token: token,
          user: user,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
