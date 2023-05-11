const { combineResolvers } = require("graphql-resolvers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const keys = require("../../config/keys");
const uuid = require("uuid");
const nodemailer = require("../../nodemailer/transport");

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
          return {
            userErrors: [
              {
                message: "Users not found!",
              },
            ],
            users: null,
          };
        }
        return {
          userErrors: [],
          users: users,
        };
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

        const characters =
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let token = "";
        for (let i = 0; i < 25; i++) {
          token += characters[Math.floor(Math.random() * characters.length)];
        }

        // creating a new instance of the user model
        // then overwrite the password with hashed password
        const newUser = new User({
          ...input,
          password: hashedPassword,
          userId: uuid.v4(),
          confirmationCode: token,
        });

        const result = await newUser.save();

        nodemailer.sendConfirmationEmail(input.name, input.email, token);

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
    verifyEmail: async (_, { input }) => {
      // console.log(input);
      try {
        const user = await User.findOne({
          confirmationCode: input.confirmationCode,
        });
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

        if (user.status === "Pending") {
          const payloadToUpdate = { status: "Active" };

          const newUser = await User.findOneAndUpdate(
            user._id,
            payloadToUpdate,
            {
              new: true,
            }
          );

          const result = await newUser.save();

          return {
            userErrors: [],
            user: result,
          };
        } else {
          return {
            userErrors: [
              {
                message: "Account is already confirmed",
              },
            ],

            user: null,
          };
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
