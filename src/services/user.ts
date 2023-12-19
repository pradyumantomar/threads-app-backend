import { createHmac, randomBytes } from "crypto";
import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";

const JWT_SECRET = String(process.env.JWT_SECRET);

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    return createHmac("sha512", salt).update(password).digest("hex");
  }

  public static async createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = await this.generateHash(salt, password);
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt,
      },
    });
  }

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await this.getUserByEmail(email);

    if (!user) throw new Error("user not found!");

    const userSalt = user.salt;
    const userHashedPassword = await this.generateHash(userSalt, password);

    if (userHashedPassword !== user.password)
      throw new Error("Incorrect Password");

    //generate jwt token
    const jwtToken = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return jwtToken;
  }

  public static decodeJwtToken(token: string) {
    return JWT.decode(token);
  }
}

export default UserService;
