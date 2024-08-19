import dotnenv from "dotenv";
dotnenv.config();

export const config = {
  BASE_URL_API: process.env["BASE_URL_API"] ?? "localhost",
  GK_URL: process.env["GK_URL"] ?? "localhost",
};
