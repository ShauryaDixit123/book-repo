import { userI } from "../interfaces/user";

export const userTable: userI[] = [
  {
    id: "990",
    name: "Michal Scot",
    email: "mg.scot@dm.com",
    password: "test1#",
    roleId: 1008,
  },
  {
    id: "991",
    name: "Dwight Schrut",
    email: "dk.schrut@dm.com",
    password: "test1#",
    roleId: 1,
  },
  {
    id: "920",
    name: "Creed Braton",
    email: "c.braton@dm.com",
    password: "test1#",
    roleId: 1008,
  },
  {
    id: "993",
    name: "Kevin Malone",
    email: "k.malone@dm.com",
    password: "test1#",
    roleId: 1,
  },
];
export const ADMIN_ROLE = { code: "ADMIN", id: 1008 };
export const USER_ROLE = { code: "USER", id: 1 };

export const userRole = [ADMIN_ROLE, USER_ROLE];
