import axios from "axios";
export async function generateLinkRegistration(baseUrl: string, email: string) {
  try {
    const url = baseUrl + `?email=${email}`;
    const response = await axios.get(url);
    return response.status;
  } catch (error) {
    throw error;
  }
}
