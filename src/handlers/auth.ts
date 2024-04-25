import express, { Request, Response } from "express";
import { authService } from "../services/login";
import { routeRoleMiddleware } from "../middleware";

export class authController {
  app: express.Express;
  constructor(app: express.Express) {
    this.app = app;
  }
  initRoutes() {
    this.app.post("/login", this.login);
  }
  login(req: Request, res: Response) {
    const { email, password } = req.body;
    const as = new authService();
    try {
      const tkn = as.loginUser(email, password);
      res.send({
        message: "success",
        token: tkn,
      });
    } catch (e) {
      throw e;
    }
  }
}
