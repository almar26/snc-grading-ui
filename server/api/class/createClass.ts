import axios from "axios";
const BASE_URL = process.env.BASE_URL;
export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const token = cookies?.token;

  try {
    const body = await readBody(event);
    const myPayload = {
      teacher_id: body.teacher_id,
      subject_code: body.subject_code,
      subject_desc: body.subject_desc,
      course_code: body.course_code,
      section: body.section,
      units: body.units,
      semester: body.semester,
      school_year: body.school_year,
      days: body.days,
      time_start: body.time_start,
      time_end: body.time_end,
      faculty_no: body.faculty_no,
      teacher_name: body.teacher_name,

    };

    const result = await axios.post(
      `${BASE_URL}/api/class/create`,
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
