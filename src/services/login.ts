import { userTable } from "../db/user";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export class authService {
  constructor() {
    this.secret = process.env.JWT_SECRET || "secret#";
  }
  secret: string;
  loginUser(email: string, password: string) {
    const usr = userTable.find((val) => val.email === email);
    if (usr?.password !== password) throw new Error("Incorrect Password");
    const token = this.genTkn(usr.id);
    return token;
  }
  getUserById(userId: string) {
    return userTable.find((val) => val.id === userId);
  }
  genTkn(str: string) {
    return jwt.sign({ userId: str }, this.secret, {
      expiresIn: "36h",
    });
  }
  decodeTkn(tkn: string) {
    return jwt.verify(tkn, this.secret);
  }
}
