import axios from "axios"
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const token = cookies?.token
  try {
    const body = await readBody(event)
    const myPayload = {
      faculty_no: body.faculty_no,
      last_name: body.last_name,
      first_name: body.first_name,
      middle_name: body.middle_name,
      email: body.email,
      gender: body.gender,
      department: body.department,
      birthday: body.birthday,
      teacher_status: body.teacher_status,
      role_view: body.role_view 
    }

    const result = await axios.post(`${BASE_URL}/api/teacher-acccount/create`, myPayload, {
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
