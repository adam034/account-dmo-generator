import dotnenv from "dotenv";
dotnenv.config();

export const config: { BASE_URL_API: string | undefined } = {
  BASE_URL_API: process.env["BASE_URL_API"],
};
