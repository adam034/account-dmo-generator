import axios from "axios";
import { URLSearchParams } from "node:url";
import puppeteer, { Page, Dialog } from "puppeteer";

export async function getRecapchaToken(
  link: string,
  email: string,
  password: string
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const browser = await puppeteer.launch({ headless: true });
  const page: Page = await browser.newPage();

  page.on("dialog", async (dialog: Dialog) => {
    console.log("Dialog appeared: ", dialog.message());
    await dialog.accept(); // Accept the dialog (click OK)
  });

  try {
    await page.goto(link);

    // Click the submit button to trigger the reCAPTCHA and other form submissions
    await page.click('button[type="submit"]');

    // Wait for the hidden input field with id 'HiddenRecaptchaToken' to have a non-empty value
    await page.waitForFunction(
      () =>
        (document.getElementById("HiddenRecaptchaToken") as HTMLInputElement)
          .value !== "",
      { timeout: 20000 }
    );

    // Retrieve the reCAPTCHA token
    const data = await page.evaluate(() => {
      const tokenField = document.getElementById(
        "HiddenRecaptchaToken"
      ) as HTMLInputElement;
      const jidValue = (
        document.querySelector('input[name="jid"]') as HTMLInputElement
      )?.value;
      const vfValue = (
        document.querySelector('input[name="vf"]') as HTMLInputElement
      )?.value;
      return {
        token: tokenField.value,
        jid: jidValue,
        vf: vfValue,
      };
    });

    return {
      email: email,
      password: password,
      link: link,
      c_token: data.token,
      jid: data.jid,
      vf: data.vf,
    };
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
}

export async function submitFormRegistration(
  cToken: string,
  jid: string,
  vf: string,
  email: string,
  password: string
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    // Extract form values
    const formData = {
      jid: jid,
      email: email,
      vf: vf,
      HiddenRecaptchaToken: cToken,
      userid2: email.split("@")[0], // Replace with your desired value
      usernick: email.split("@")[0], // Replace with your desired value
      userpw: password, // Replace with your desired value
      userpwchk: password, // Replace with your desired value
      birthMM: "11", // Replace with your desired value
      birthDD: "13", // Replace with your desired value
      birthYYYY: "1994", // Replace with your desired value
      U_checkAgreement1: "on", // This is typically checked
    };

    // Convert formData to URLSearchParams format
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(formData)) {
      params.append(key, String(value || ""));
    }

    // Submit form data
    const response = await axios.post(
      "https://dmo.gameking.com/Sign/SignUpComplete.aspx",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return {
      status: response.status,
      email: email,
      password_mail: password,
      user_id_game: email.split("@")[0],
      password_game: password,
    };
  } catch (error) {
    console.error("Error fetching or submitting the form:", error);
  }
}
