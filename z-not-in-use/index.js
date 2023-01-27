const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const getUserFromToken = require("./utils/getUserFromToken");
const BoredAPI = require("./graphql/dataSources/bored-api");

const path = require("path");

// const cookieSession = require("cookie-session");
const passport = require("passport");
// require("./services/passport");
const keys = require("./config/keys");
// require("./database/models/UserGoogle");
require("./database/models/User");
require("./database/models/Survey");
// require("./services/passport");
// const authRoutes = require("./routes/authRoutes");
// const billingRoutes = require("./routes/billingRoutes");
// const surveyRoutes = require("./routes/surveyRoutes");
const connection = require("./database");

// MongoDB connect
connection();

// const app1 = express();

// app1.use(bodyParser.json());

// instruct passort to keep track of user by using cookie session
// app1.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: [keys.cookieKey],
//   })
// );

// app1.use(passport.initialize());
// app1.use(passport.session());

// authRoutes(app1);
// billingRoutes(app1);
// surveyRoutes(app1);

// if (process.env.NODE_ENV === "production") {
//   // Express will serve up production assets like our main.js, main.css
//   app1.use(express.static("client/build"));

//   // Express will serve up the index.html if it doesn't recognise the route
//   app1.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// const PORT = process.env.PORT || 5000;
// app1.listen(PORT, () => console.log(`Server is running on ${PORT}`));

async function startApolloServer(typeDefs, resolvers) {
  const app2 = express();

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app2);

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Ensure we wait for our server to start
  await server.start();

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app2.use(
    "/",
    cors(),
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    bodyParser.json({ limit: "50mb" }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      // context: async ({ req }) => ({ token: req.headers.token }),
      context: async ({ req, res }) => {
        const { cache } = server;

        console.log(req.headers.authorization);
        const userInfo = await getUserFromToken(req.headers.authorization);
        // console.log(userInfo);

        return {
          userInfo,
          // We create new instances of our data sources with each request,
          // passing in our server's cache.
          boredAPI: new BoredAPI({ cache }),
        };
      },
    })
  );

  // instruct passort to keep track of user by using cookie session
  // app2.use(
  //   cookieSession({
  //     maxAge: 30 * 24 * 60 * 60 * 1000,
  //     keys: [keys.cookieKey],
  //   })
  // );

  // app2.use(passport.initialize());
  // app2.use(passport.session());

  // Modified server startup
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Apollo Server ready at http://localhost:4000/`);
}

startApolloServer(typeDefs, resolvers);
