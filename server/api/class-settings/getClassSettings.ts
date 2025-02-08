import axios from "axios";
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event);
    const token = cookies?.token
    const result = await axios.get(`${BASE_URL}/api/class-settings`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (result) {
      return result.data;
    }
  } catch (err) {
    console.log(err);
  }
})
