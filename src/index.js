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

// require("./database/models/ser");
// require("./database/models/Survey");

const connection = require("./database");

// MongoDB connect
connection();

// if (process.env.NODE_ENV === "production") {
//   // Express will serve up production assets like our main.js, main.css
//   app1.use(express.static("client/build"));

//   // Express will serve up the index.html if it doesn't recognise the route
//   app1.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

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

        // console.log(req.headers.authorization);
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

  // Modified server startup
  await new Promise(resolve =>
    httpServer.listen({ port: process.env.PORT || 4000 }, resolve)
  );
  console.log(`🚀 Apollo Server ready at http://localhost:4000/`);
}

startApolloServer(typeDefs, resolvers);
