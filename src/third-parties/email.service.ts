import axios from "axios";
import { base64Decode } from "../utils/decoder";

export async function getDomains(baseUrl: string) {
  try {
    const url = baseUrl + "/domains";
    return (await axios.get(url)).data;
  } catch (error) {
    return error;
  }
}

export async function registerEmail(
  baseUrl: string,
  email: { address: string; password: string }
) {
  try {
    const url = baseUrl + "/accounts";
    const response = await axios.post(url, email);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function login(baseUrl: string, email: string, password: string) {
  try {
    const url = baseUrl + "/token";
    const response = await axios.post(url, {
      address: email,
      password: password,
    });
    return {
      email: email,
      password: password,
      response: response.data,
    };
  } catch (error) {
    throw error;
  }
}

export async function getMessage(
  baseUrl: string,
  token: string,
  email: string,
  password: string
) {
  try {
    const url = baseUrl + "/messages";
    const message = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const messageId = message.data["hydra:member"][0].id;

    const sourceUrl = baseUrl + `/sources/${messageId}`;
    const source = await axios.get(sourceUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const link = base64Decode(source.data.data, 81);

    return {
      email: email,
      password: password,
      link: link,
    };
  } catch (error) {
    throw error;
  }
}
