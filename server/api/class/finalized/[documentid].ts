import axios from 'axios'
const BASE_URL = process.env.BASE_URL

export default defineEventHandler(async (event) => {
  const documentid = getRouterParam(event, 'documentid')
  const cookies = parseCookies(event);
  const token = cookies?.token
  try {
    const body = await readBody(event);
    const myPayload = {
      finalize: body.finalized
    }
    const result = await axios.put(`${BASE_URL}/api/class/finalized/${documentid}`, myPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        
      }
    });
    if (result) {
      return result.data;
    }
  } catch (err) {
    console.log(err);
  }
})
