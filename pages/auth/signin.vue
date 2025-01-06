<template>
  <div class="d-flex align-center justify-center px-10" style="height: 100vh">
    <v-card width="450" class="mx-auto card-border elevation-0 pt-10" outlined>
      <div class="hr-sect">
        <v-img
          src="\SNC-Logo.png"
          max-height="120"
          class="mb-5"
          contain
        ></v-img>
      </div>

      <!-- <v-card-text>
				<v-row>
					<v-col>
						<a href="https://prod-wd-snc-server-dq5acxrlua-df.a.run.app/api/connect/microsoft"
							><v-img src="/ms-symbollockup_signin_dark.svg"></v-img
						></a>
					</v-col>
				</v-row>
			</v-card-text> -->
      <div class="login-text">Sign In</div>

      <v-form
        ref="loginForm"
        v-model="valid"
        lazy-validation
        class="mx-10 mt-4 mb-10"
        @submit.prevent="login"
      >
        <v-text-field
          v-model="user.identifier"
          rounded
          :rules="usernameRules"
          variant="outlined"
          label="Username"
          @input="user.identifier = user.identifier.toUpperCase()"
          prepend-inner-icon="mdi-account"
          required
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          rounded
          :rules="passwordRules"
          variant="outlined"
          label="Password"
          :type="showPass ? 'text' : 'password'"
          @click:append-inner="showPass = !showPass"
          prepend-inner-icon="mdi-lock"
          required
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          :loading="loading"
          color="primary"
          class="mt-5"
          rounded
          size="large"
          block
          type="submit"
        >
          Sign In
        </v-btn>
      </v-form>
      <!-- <div class="hr-sect mx-15 my-5">or sign in with</div> -->
      <!-- <v-row class="mx-15">
				
				<v-col cols="auto" class="mr-auto">
					<v-btn outlined color="#404040" block><v-icon color="red" start>mdi-google</v-icon> Google</v-btn>
				</v-col>
				<v-col cols="auto">
					<v-btn outlined color="#404040" block
						href="https://prod-wd-snc-server-dq5acxrlua-df.a.run.app/api/connect/microsoft"><v-icon
							color="blue" start>mdi-microsoft</v-icon> Microsoft</v-btn>
				</v-col>
			</v-row>
			<v-card-actions class="mb-10 text-center">
				<v-spacer></v-spacer>
				<NuxtLink to="/auth/signup" class="nuxt-link">Create an account</NuxtLink>
				<v-spacer></v-spacer>
			</v-card-actions> -->

      <p class="version">{{ version }}</p>
    </v-card>

    <v-snackbar v-model="snackbar" location="top" color="red" variant="tonal">
      {{ text }}

      <template v-slot:actions>
        <v-btn variant="icon" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "auth",
});
useHead({
  title: "Log In",
});

const router = useRouter();
const { authenticateUser } = useMyAuthStore(); // use authenticateUser action from auth store
const { authenticated } = storeToRefs(useMyAuthStore()); // make authenticated state reactive with storeToRefs
const { userInfo } = storeToRefs(useMyAuthStore()); // make userInfo state reactive
const { errorLogin } = storeToRefs(useMyAuthStore()); // make errorLogin state reactive
const { errorMessage } = storeToRefs(useMyAuthStore()); // make errorMessage state reactive

const valid = ref(true);
const loading = ref(false);
const showPass = ref(false);
const user = ref({
  identifier: "",
  password: "",
});
const loginForm = ref(null);
const usernameRules = [
  (v) => !!v || "Username is required",
  // (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"
];
const passwordRules = [(v) => !!v || "Password is required"];
const snackbar = ref(false);
const text = ref("HHHHHH");
const version = ref("version 1.0.4.16")

// FUNCTIONS
async function login() {
  const { valid, errors } = await loginForm.value?.validate();
  loading.value = true;
  if (valid) {
    await authenticateUser(user.value); // call autheticateUser and pass the user object
    if (authenticated) {
      loading.value = false;
      router.push("/");
    }
    if (errorLogin.value == true) {
      //console.log("Error login", errorLogin.value)
      snackbar.value = true;
      loading.value = false;
      //console.log("Error Message:", errorMessage.value)
      if (errorMessage.value == "") {
        text.value = "Invalid identifier or password";
      } else {
        text.value = errorMessage.value;
        //text.value =  "Invalid identifier or password";
      }
    }
  }
  //console.log("Error Login", errorLogin.value)
}
</script>

<style scoped>
.login-text {
  font-size: 22px;
  text-align: center;
  font-weight: bold;
}
.nuxt-link {
  text-decoration: none;
  padding-top: 5px;
  color: #2196f3;
}

.card-border {
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 7px 29px 0px;
}

.hr-sect {
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: rgba(0, 0, 0, 0.9);
  margin: 8px 0;
}

.hr-sect::before,
.hr-sect::after {
  content: "";
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.15);
  height: 1px;
  font-size: 0;
  line-height: 0;
  margin: 0 8px;
}
.version {
  text-align: center;
  font-size: 14px;
  margin-bottom: 15px;
  color: rgba(0, 0, 0, 0.74);
}
</style>
