import axios from 'axios'
const BASE_URL = process.env.BASE_URL
export default defineEventHandler(async (event) => {
  // const studentid = getRouterParam(event, 'studentid')
  const query = getQuery(event);
  const cookies = parseCookies(event);
  const token = cookies?.token
  try {
    // const result = await axios.get(`${BASE_URL}/api/student-subject/grades/${studentid}`, {
    const result = await axios.get(`${BASE_URL}/api/student-subject/grades?studentid=${query.student_id}&sy=${query.sy}&semester=${query.semester}`, {
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
