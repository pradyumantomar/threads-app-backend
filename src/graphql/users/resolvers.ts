import UserService, {
  CreateUserPayload,
  GetUserTokenPayload,
} from "../../services/user";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const token = await UserService.getUserToken(payload);
    return token;
  },
  getCurrentUserLoggedIn: async (_: any, paramter: any, context: any) => {
    if (context && context.user) {
      const userId = context.user.id;
      const user = await UserService.getUserById(userId);
      return user;
    }
    throw new Error("UnAuthorized User not Allowed");
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
