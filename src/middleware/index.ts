import { NextFunction, Request, Response } from "express";
import { authService } from "../services/login";
import { userTable } from "../db/user";

export const routeRoleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Time:", Date.now());
  const tkn = req.header("Authorization");
  const as = new authService();
  if (!tkn) {
    return res.status(401).json({ error: "Token not available" });
  }
  try {
    const resp: any = as.decodeTkn(tkn);
    const uid = resp["userId"];
    req.headers["userId"] = resp["userId"];
    req.headers["roleId"] =
      userTable.find((v) => v.id == uid)?.roleId.toString() || "";
    console.log(uid, req.headers["roleId"]);
  } catch (e) {
    return res.status(500).json({ message: e });
  }
  next();
};
