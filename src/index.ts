import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { authController } from "./handlers/auth";
import { routeRoleMiddleware } from "./middleware";
import { bookController } from "./handlers/book";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const ac = new authController(app);
const bc = new bookController(app);
ac.initRoutes();
bc.initRoutes();
app.get("/ping", routeRoleMiddleware, (_, res) => res.send("pong!"));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
