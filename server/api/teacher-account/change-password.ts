import axios from "axios"
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const token = cookies?.token
  try {
    const body = await readBody(event)
    const myPayload = JSON.stringify({
      currentPassword: body.old_password,
      password: body.new_password,
      passwordConfirmation: body.confirm_password
    })

    const result = await axios.post(`${BASE_URL}/api/auth/change-password`, myPayload, {
      headers: {
        "Content-Type": "application/json",
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
