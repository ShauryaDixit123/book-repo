import { parse } from "csv-parse";
import { Response } from "express";
import { promises as fsP } from "fs";
import * as fs from "fs";
import * as csvlib from "csv";
import { writeFile } from "fs/promises";

export type Book = {
  ID: string;
  Title: string;
  Author: string;
  Year: number;
  Pages: number;
  Rating: number;
};
export class bookService {
  async readBookByCSVpath(path: string, endCallback: (bk: Book[]) => void) {
    const resAr: Book[] = [];
    const prsr = fs
      .createReadStream(path)
      .pipe(parse({ delimiter: ",", fromLine: 2 }));
    for await (const r of prsr) {
      const bk = await cvtRowsToBook(r);
      resAr.push(bk);
    }
    endCallback(resAr);
    return resAr;
  }

  writeToCSV(path: string, data: any[]) {
    const str = data.reduce((ac, v) => {
      ac += `"${v.ID}","${v.Title}","${v.Author}",${v.Year},${v.Pages},${v.Rating}\n`;
      return ac;
    }, `ID,Title,Author,Year,Pages,Rating\n`);
    writeFile(path, str, "utf-8")
      .then(() => console.log("written!"))
      .catch((e) => console.log(e));
  }
  addBookValidation(bk: Book) {
    if (typeof bk.Author !== "string") {
      return new Error("Author must be string");
    }
    if (typeof bk.Title !== "string") {
      return new Error("Title must be string");
    }
    if (typeof bk.Year !== "number" && String(bk.Year).length <= 4) {
      return new Error("Year must be number");
    }
    return null;
  }
}

export async function cvtRowsToBook(row: string[]) {
  const bk: Book = {
    ID: "",
    Title: "",
    Author: "",
    Year: 0,
    Pages: 0,
    Rating: 0,
  };
  row.forEach((r, i) => {
    i == 0
      ? (bk.ID = r)
      : i == 1
      ? (bk.Title = r)
      : i == 2
      ? (bk.Author = r)
      : i == 3
      ? (bk.Year = parseInt(r))
      : i == 4
      ? (bk.Pages = parseInt(r))
      : i == 5
      ? (bk.Rating = parseInt(r))
      : null;
  });
  return bk;
}
