import { prismaClient } from "../lib/db";
import { ApolloServer } from "@apollo/server";
import { User } from "./users";

async function createApolloGraphqlServer() {
  //create Graphql Server
  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            ${User.queries}
           
        },
        type Mutation{
            ${User.mutations}
        } `, //Schema as string
    resolvers: {
      Query: { ...User.resolvers.queries },
      Mutation: { ...User.resolvers.mutations },
    }, // functions (logic)
  });

  //start Graphql Server
  await gqlServer.start();

  return gqlServer;
}

export default createApolloGraphqlServer;
