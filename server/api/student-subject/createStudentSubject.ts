import axios from "axios"
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const token = cookies?.token
  try {
    const body = await readBody(event)
    const myPayload = {
      class_id: body.class_id,
      student_id: body.student_id,
      student_no: body.student_no,
      subject_code: body.subject_code,
      course_code: body.course_code,
      course_description: body.course_description,
      section: body.section,
      unit: body.units,
      semester: body.semester,
      school_year: body.school_year,
      grade: body.grade,
      numeric_grade: body.numeric_grade,
      remarks: body.remarks,
      teacher_id: body.teacher_id,
    }

    const result = await axios.post(`${BASE_URL}/api/student-subject/create`, myPayload, {
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
