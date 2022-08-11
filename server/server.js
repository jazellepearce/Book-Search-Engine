const typeDefs = require("./Schemas");
const resolvers = require("./Schemas/resolvers");
const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const http = require("http");

//const app = express();
const PORT = process.env.PORT || 3001;

// if we're in production, serve client/build as static assets

db.once("open", () => {
  //app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));

  async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/build")));
    }

    app.use(routes);
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      csrfPrevention: true,
      cache: "bounded",
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  }
  startApolloServer(typeDefs, resolvers);
});
