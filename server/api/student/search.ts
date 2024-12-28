import axios from "axios";
const BASE_URL = process.env.BASE_URL;

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event);
    const query = getQuery(event);
    const token = cookies?.token;
    const result = await axios.get(
      `${BASE_URL}/api/student/search?searchid=${query.searchid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if(result) {
      return result.data;
    }
  } catch (err) {
    console.log(err);
  }
});
