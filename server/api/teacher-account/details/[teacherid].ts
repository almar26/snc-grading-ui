import axios from 'axios'
const BASE_URL = process.env.BASE_URL
export default defineEventHandler(async (event) => {
  const teacherid = getRouterParam(event, 'teacherid')
  const cookies = parseCookies(event);
  const token = cookies?.token
  try {
    const result = await axios.get(`${BASE_URL}/api/teacher-acccount/details/${teacherid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(result) {
      return result.data;
    }
  } catch (err) { 
    console.log(err);
  }
})
