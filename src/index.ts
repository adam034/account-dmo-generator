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
import {
  getRecapchaToken,
  submitFormRegistration,
} from "./third-parties/scrap";

// (async () => {
//   const randomEmails: { address: string; password: string }[] = [];
//   const resultRegisteredEmails: any[] = [];
//   const tokens: { email: string; password: string; token: string }[] = [];
//   const linkAccounts: { email: string; password: string; link: string }[] = [];
//   const cTokens: {
//     email: string;
//     password: string;
//     link: string;
//     c_token: string;
//     jid: string;
//     vf: string;
//   }[] = [];
//   const users: {
//     status: any;
//     email: string | undefined;
//     password_mail: string | undefined;
//     user_id_game: string | undefined;
//     password_game: string | undefined;
//   }[] = [];

//   const rl = readline.createInterface({ input, output });

//   const counter = await rl.question("Masukkan jumlah email:");

//   // ==== GET EMAIL DOMAIN =====
//   console.log("====PROCESS CHECKING NEW MAIL DOMAIN====");
//   const respDomain = await getDomains(config.BASE_URL_API);
//   const domain = respDomain["hydra:member"][0].domain;
//   console.log("====FINISH CHECKING NEW MAIL DOMAIN====");

//   // ==== CREATE USER FAKER WITH EXISTING EMAIL DOMAIN ====
//   console.log("====PROCESS GENERATE RANDOM EMAIL====");
//   for (let i = 0; i < Number(counter); i++) {
//     const fakeUser = generateRandomUser(domain);
//     randomEmails.push(fakeUser);
//   }
//   console.log("====FINISH GENERATE RANDOM EMAIL====");

//   // ==== REGISTER RANDOM MAIL TO MAIL.TM SERVICE ====
//   console.log(
//     "====PROCESS CREATE REGISTER RANDOM EMAIL TO MAIL.TM SERVICE===="
//   );
//   const registeredEmails = randomEmails.map((re) =>
//     registerEmail(config.BASE_URL_API, re)
//   );

//   await Promise.all(registeredEmails)
//     .then((results) => {
//       results.forEach((result, _) => {
//         resultRegisteredEmails.push({
//           email: result.address,
//           password: randomEmails.find((re) => re.address === result.address)
//             ?.password,
//         });
//       });
//     })
//     .catch((error) => {
//       console.error("Error posting data:", error);
//     });
//   console.log("====FINISH CREATE REGISTER RANDOM EMAIL TO MAIL.TM SERVICE====");

//   // ==== REGISTER ACCOUNT TO GAMEKING ====
//   console.log("====PROCESS CREATE REGISTER RANDOM EMAIL GAMEKING====");
//   const accountCreated = resultRegisteredEmails.map((rre) =>
//     generateLinkRegistration(config.GK_URL, rre.email)
//   );
//   Promise.all(accountCreated)
//     .then((results) => {
//       console.log("results:", results);
//       // Process all results here
//       results.forEach((result, index) => {
//         console.log(`Result for data ${index + 1}:`, result);
//       });
//     })
//     .catch((error) => {
//       console.error("Error posting data:", error);
//       // Handle the error or errors here
//     });
//   console.log("====FINISH CREATE REGISTER RANDOM EMAIL GAMEKING====");

//   // ==== GET LINK REGISTRATION FROM MAIL INBOX ====
//   console.log("====PROCESS GET LINK REGISTRATION FROM MAIL INBOX====");

//   const getToken = resultRegisteredEmails.map((rre) =>
//     login(config.BASE_URL_API, rre.email, rre.password)
//   );
//   await Promise.all(getToken)
//     .then((results) => {
//       results.forEach((result, _) => {
//         tokens.push({
//           email: result.email,
//           password: result.password,
//           token: result.response.token,
//         });
//       });
//     })
//     .catch((error) => {
//       console.error("Error posting data:", error);
//     });

//   setTimeout(async () => {
//     const getLinkAccount = tokens.map((t) =>
//       getMessage(config.BASE_URL_API, t.token, t.email, t.password)
//     );
//     await Promise.all(getLinkAccount)
//       .then((results) => {
//         results.forEach((result, _) => {
//           linkAccounts.push({
//             email: result.email,
//             password: result.password,
//             link: result.link,
//           });
//         });
//       })
//       .catch((error) => {
//         console.error("Error read message:", error);
//       });
//     console.log("====FINISH GET LINK REGISTRATION FROM MAIL INBOX====");

//     console.log("====PROCESS GET CAPTCHA TOKEN FORM====");
//     for (let i = 0; i < linkAccounts.length; i++) {
//       console.log(`start iteration - ${i + 1}`);
//       const result = await getRecapchaToken(
//         linkAccounts[i].link,
//         linkAccounts[i].email,
//         linkAccounts[i].password
//       );
//       cTokens.push(result);
//       console.log(`finish iteration - ${i + 1}`);
//     }
//     console.log("====FINISH GET CAPTCHA TOKEN FORM====");

//     console.log("====PROCESS SUBMIT FORM REGISTRATION====");
//     for (let i = 0; i < cTokens.length; i++) {
//       console.log(`start iteration - ${i + 1}`);
//       const result = await submitFormRegistration(
//         cTokens[i].c_token,
//         cTokens[i].jid,
//         cTokens[i].vf,
//         cTokens[i].email,
//         cTokens[i].password
//       );
//       users.push({
//         status: result?.status,
//         email: result?.email,
//         password_mail: result?.password_mail,
//         user_id_game: result?.user_id_game,
//         password_game: result?.password_game,
//       });
//       console.log(`finish iteration - ${i + 1}`);
//     }
//     console.log("====FINISH SUBMIT FORM REGISTRATION====");
//     console.log(users);
//     // export to csv
//     await exportToCsv(users, "account.csv");
//   }, 50000);

//   rl.close();
// })();

(async () => {
  const rl = readline.createInterface({ input, output });

  console.log("====OPTION=====");
  console.log("1.ADD EMAIL");
  console.log("2.GENERATE ACCOUNT DMO");

  const opsi = await rl.question("CHOSE OPTION: ");
  if (opsi === "1") {
    const email = await rl.question("ADD EMAIL(text): ");
    console.log(email);
    rl.close();
  }
  if (opsi === "2") {
    const jumlahAccount = await rl.question("ADD ACCOUNT(number): ");
    console.log(jumlahAccount);
    rl.close();
  }
})();
