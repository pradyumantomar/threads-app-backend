import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  //create Graphql Server
  const gqlServer = new ApolloServer({
    typeDefs: "", //Schema as string
    resolvers: {}, // functions (logic)
  });

  //start Graphql Server
  await gqlServer.start();

  app.get("/", (req, res) =>
    res.json({
      message: "Server is up & running ",
    })
  );

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`Server is running at Port : ${PORT} 😎`));
}

init();
