import axios from "axios";
const BASE_URL = process.env.BASE_URL;

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const token = cookies?.token;
  try {
    const body = await readBody(event);
    const myPayload = {
      student_list: body.student_list,
    };

    const result = await axios.post(
      `${BASE_URL}/api/student-subject/importMultipleStudents`,
      myPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (result) {
      return result.data;
    }
  } catch (err) {
    console.log(err);
  }
});
