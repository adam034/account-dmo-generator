import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { config } from "./environments/environment";
import {
  getDomains,
  getMessage,
  login,
  registerEmail,
} from "./third-parties/email.service";
import { generateRandomUser } from "./utils/generator";
import { generateLinkRegistration } from "./third-parties/gk.service";
import { exportToCsv } from "./utils/write_file";

(async () => {
  const randomEmails: { address: string; password: string }[] = [];
  const resultRegisteredEmails: any[] = [];
  const tokens: { email: string; password: string; token: string }[] = [];
  const linkAccounts: { email: string; password: string; link: string }[] = [];

  const rl = readline.createInterface({ input, output });

  const counter = await rl.question("Masukkan jumlah email:");

  // ==== GET EMAIL DOMAIN =====
  console.log("PROCESS CHECKING NEW MAIL DOMAIN");
  const respDomain = await getDomains(config.BASE_URL_API);
  const domain = respDomain["hydra:member"][0].domain;
  console.log("FINISH CHECKING NEW MAIL DOMAIN");

  // ==== CREATE USER FAKER WITH EXISTING EMAIL DOMAIN ====
  console.log("PROCESS GENERATE RANDOM EMAIL");
  for (let i = 0; i < Number(counter); i++) {
    const fakeUser = generateRandomUser(domain);
    randomEmails.push(fakeUser);
  }
  console.log("FINISH GENERATE RANDOM EMAIL");

  // ==== REGISTER RANDOM MAIL TO MAIL.TM SERVICE ====
  console.log("PROCESS CREATE REGISTER RANDOM EMAIL TO MAIL.TM SERVICE");
  const registeredEmails = randomEmails.map((re) =>
    registerEmail(config.BASE_URL_API, re)
  );

  await Promise.all(registeredEmails)
    .then((results) => {
      results.forEach((result, _) => {
        resultRegisteredEmails.push({
          email: result.address,
          password: randomEmails.find((re) => re.address === result.address)
            ?.password,
        });
      });
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });
  console.log("FINISH CREATE REGISTER RANDOM EMAIL TO MAIL.TM SERVICE");

  // ==== REGISTER ACCOUNT TO GAMEKING ====
  console.log("PROCESS CREATE REGISTER RANDOM EMAIL GAMEKING");
  const accountCreated = resultRegisteredEmails.map((rre) =>
    generateLinkRegistration(config.GK_URL, rre.email)
  );
  Promise.all(accountCreated)
    .then((results) => {
      console.log("results:", results);
      // Process all results here
      results.forEach((result, index) => {
        console.log(`Result for data ${index + 1}:`, result);
      });
    })
    .catch((error) => {
      console.error("Error posting data:", error);
      // Handle the error or errors here
    });
  console.log("FINISH CREATE REGISTER RANDOM EMAIL GAMEKING");

  // ==== GET LINK REGISTRATION FROM MAIL INBOX ====
  console.log("PROCESS GET LINK REGISTRATION FROM MAIL INBOX");

  const getToken = resultRegisteredEmails.map((rre) =>
    login(config.BASE_URL_API, rre.email, rre.password)
  );
  await Promise.all(getToken)
    .then((results) => {
      results.forEach((result, _) => {
        tokens.push({
          email: result.email,
          password: result.password,
          token: result.response.token,
        });
      });
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });

  setTimeout(async () => {
    const getLinkAccount = tokens.map((t) =>
      getMessage(config.BASE_URL_API, t.token, t.email, t.password)
    );
    await Promise.all(getLinkAccount)
      .then((results) => {
        results.forEach((result, _) => {
          linkAccounts.push({
            email: result.email,
            password: result.password,
            link: result.link,
          });
        });
      })
      .catch((error) => {
        console.error("Error read message:", error);
      });
    console.log("FINISH GET LINK REGISTRATION FROM MAIL INBOX");

    console.log(linkAccounts);

    // export to csv
    await exportToCsv(linkAccounts, "account.csv");
  }, 50000);

  rl.close();
})();
