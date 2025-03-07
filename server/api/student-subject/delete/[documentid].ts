import axios from 'axios'
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const documentid = getRouterParam(event, 'documentid')
  const cookies = parseCookies(event);
  const token = cookies?.token
  try {
    const result = await axios.delete(`${BASE_URL}/api/student-subject/delete/${documentid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (result) {
      return result.data;
    }
  } catch (err) {
    console.log(err);
  }
})
