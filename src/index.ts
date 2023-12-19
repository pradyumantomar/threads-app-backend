import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";
import { randomInt } from "crypto";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) =>
    res.json({
      message: "Server is up & running ",
    })
  );

  const gqlServer = await createApolloGraphqlServer();
  app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
      context: async ({ req }) => {
        const token = req.headers["token"];

        try {
          const user = UserService.decodeJwtToken(token as string);

          return { user };
        } catch (error) {
          return "UnAuthorized User";
        }
      },
    })
  );

  app.listen(PORT, () => console.log(`Server is running at Port : ${PORT} 😎`));
}

init();
