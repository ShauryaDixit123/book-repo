import express, { Request, Response } from "express";
import { parse } from "csv-parse";
// import { promises as fs } from "fs";
import { Book, bookService, cvtRowsToBook } from "../db/books";
import { v4 as uuidv4 } from "uuid";
import { ADMIN_ROLE, USER_ROLE, userRole } from "../db/user";
import { routeRoleMiddleware } from "../middleware";

export class bookController {
  app: express.Express;
  constructor(app: express.Express) {
    this.app = app;
  }
  initRoutes() {
    this.app.get("/home", routeRoleMiddleware, this.list);
    this.app.post("/addBook", routeRoleMiddleware, this.create);
    this.app.delete("/deleteBook", routeRoleMiddleware, this.delete);
  }

  async list(req: Request, res: Response) {
    const bs = new bookService();
    const ur = Number(req.headers["roleId"]);
    const regpth = "src/db/csv/regularUser.csv";
    const adpth = "src/db/csv/adminUser.csv";
    await bs.readBookByCSVpath(regpth, async (v) => {
      if (ur == ADMIN_ROLE.id) {
        await bs.readBookByCSVpath(adpth, (k) => {
          console.log([...v, ...k].length);
          res.json({ data: [...v, ...k] });
          return;
        });
      }
      res.json({ data: [...v] });
      return;
    });
  }
  async create(req: Request, res: Response) {
    const ur = Number(req.headers["roleId"]);
    if (ur !== ADMIN_ROLE.id) {
      return res.status(403).json({ message: "forbidden" });
    }
    const regPath = "src/db/csv/regularUser.csv";
    const bk: Book = req.body;
    const bs = new bookService();
    const bvEr = bs.addBookValidation(bk);
    if (bvEr !== null) {
      res.status(500).json({ message: bvEr.message });
      return;
    }
    const regB: Book[] = [];
    bk.ID = uuidv4();
    bk.Rating = 0;
    bk.Pages = bk.Pages || 100;
    await bs.readBookByCSVpath(regPath, async (v) => {
      regB.push(...v, bk);
      bs.writeToCSV(regPath, [...v, bk]);
      return res.json({ message: "written" });
    });
  }
  async delete(req: Request, res: Response) {
    const ur = Number(req.headers["roleId"]);
    if (ur !== ADMIN_ROLE.id) {
      return res.status(403).json({ message: "forbidden" });
    }
    const regPath = "src/db/csv/regularUser.csv";
    const tit = req.body.title;
    const bs = new bookService();
    await bs.readBookByCSVpath(regPath, async (v) => {
      const filRegB = v.filter((val) => {
        console.log(val.Title);
        if (
          val.Title !== undefined &&
          val.Title.toLowerCase().split(" ").join("") !==
            tit.toLowerCase().split(" ").join("")
        ) {
          return val;
        }
      });
      if (filRegB.length == 0) {
        res.status(501).json({ message: "no record found" });
        return;
      }
      bs.writeToCSV(regPath, filRegB);
      return res.status(200).json({ message: "successfully deleted" });
    });
  }
}
