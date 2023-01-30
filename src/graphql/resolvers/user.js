const { combineResolvers } = require("graphql-resolvers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const keys = require("../../config/keys");
const uuid = require("uuid");

// Getting data from database
const User = require("../../database/models/User");
// const User = mongoose.model("users");

module.exports = {
  Query: {
    user: async (_, { input }) => {
      try {
        // checking database if the user exists
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error("User not found!");
        }
        return user;
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
          throw new Error("Email already in use");
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
        // console.log(result._id, typeof result._id);
        // console.log(result.id, typeof result.id);
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(
          input.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Incorrect Password");
        }
        // const secret = process.env.JWT_SECRET_KEY || "password";
        const secret = keys.jwtSinganiture;

        // const token = jwt.sign({ email: user.email }, "password", {
        //   expiresIn: "1d",
        // });

        const token = jwt.sign({ email: user.email }, secret);

        return { token: token };
      } catch (error) {
        throw new Error("User not found");
      }
    },
  },
};
