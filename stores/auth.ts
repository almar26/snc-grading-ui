import { defineStore } from 'pinia'

interface UserPayloadInterface {
  identifier: string;
  password: string;
}

export const useMyAuthStore = defineStore({
  id: 'myAuthStore',
  state: () => ({
    authenticated: false,
    loading: false,
    userInfo: {},
    errorLogin: false,
    errorMessage: ""
  }),
  actions: {

    // Login Function
    async authenticateUser({ identifier, password }: UserPayloadInterface) {
      const baseUrl = useRuntimeConfig().public.baseURL;
      const loginUrl = useRuntimeConfig().public.loginURL
      const { data, pending, error }: any = await useFetch(`${baseUrl}/api/auth/local`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: {
          identifier,
          password,
        }
      });
      this.loading = pending;

      if (data.value) {
      let userRole = data?.value?.user.role_view;
       // console.log("User data: ", userRole);
        if (userRole !== 'dean' && userRole !== 'teacher') {
          //console.log("Invalid account type!");
          this.errorLogin = true;
          return error;
          // return alert("Invalid account type")
        }
        localStorage.setItem("user-info", JSON.stringify(data.value)); // set user-info data to local storage
        const token = useCookie('token'); // useCookie new hook in nuxt 3
        token.value = data?.value?.jwt; // set token to cookie
        this.authenticated = true; // set authenticated state value to true
        this.errorLogin = false; // set errorLogin state value to false
      } else {
        this.errorLogin = true; // set errorLogin state value to true
        this.errorMessage = error.value.data.error.message;
        //this.errorMessage = "Invalid username or password";
        //console.log(data);
        //console.log(error.value.data.error.message);
      }
    },

    // Logout Function
    logUserOut() {
      const token = useCookie('token'); // useCookie new hook in nuxt 3
      token.value = null; // clear the token cookie
      this.authenticated = false; // set authenticated state value to false
      this.userInfo = {}; // set the userinfo state value to empty
      localStorage.removeItem("user-info"); // remove the user-info data to local storage
    }
  }
})
