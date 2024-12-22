import axios from 'axios'
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const teacherid = getRouterParam(event, 'teacherid')
  const cookies = parseCookies(event);
  const token = cookies?.token
  try {
    const body = await readBody(event);
    const myPayload = {
      faculty_no: body.faculty_no,
      faculty_no_duplicate: body.faculty_no_duplicate,
      last_name: body.last_name,
      first_name: body.first_name,
      middle_name: body.middle_name,
      email: body.email,
      gender: body.gender
    }
    const result = await axios.put(`${BASE_URL}/api/teacher-account/update/${teacherid}`, myPayload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (result) {
      return result.data;
    }
  } catch (err) {
    console.log(err);
  }
})
