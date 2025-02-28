<template>
  <div>
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <div class="d-flex align-center justify-center" style="height: 80vh" v-if="loader">
      <VueSpinnerPie color="orange" size="50" />
    </div>
    <div v-else>
      <v-row justify="center">
        <v-col cols="12" md="7">
          <v-card elevation="0" class="card-outlined">
            <v-toolbar color="transparent">
              <v-toolbar-title class="title-color"><v-icon start>mdi-account-circle</v-icon> Profile
                Information</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="py-10">
              <v-row dense justify="center">
                <v-col cols="12" md="3">
                  <!-- <v-list-subheader class="d-none d-md-block">Email</v-list-subheader> -->
                  <v-sheet class="mr-8 label-color"> Faculty No </v-sheet>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field density="compact" disabled v-model="facultyno"
                    variant="outlined"></v-text-field></v-col>
              </v-row>

              <v-row dense justify="center">
                <v-col cols="12" md="3">
                  <v-sheet class="mr-8 label-color"> Last name </v-sheet>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field density="compact" disabled v-model="lastname" variant="outlined"></v-text-field></v-col>
              </v-row>
              <v-row dense justify="center">
                <v-col cols="12" md="3">
                  <v-sheet class="mr-8 label-color"> First name </v-sheet>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field density="compact" disabled v-model="firstname"
                    variant="outlined"></v-text-field></v-col>
              </v-row>
              <v-row dense justify="center">
                <v-col cols="12" md="3">
                  <v-sheet class="mr-8 label-color"> Middle name </v-sheet>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field density="compact" disabled v-model="middlename"
                    variant="outlined"></v-text-field></v-col>
              </v-row>

              <v-row dense justify="center">
                <v-col cols="12" md="3">
                  <v-sheet class="mr-8 label-color"> Department </v-sheet>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field density="compact" disabled v-model="department"
                    variant="outlined"></v-text-field></v-col>
              </v-row>
              <v-row dense justify="center">
                <v-col cols="12" md="3">
                  <!-- <v-list-subheader class="d-none d-md-block">Email</v-list-subheader> -->
                  <v-sheet class="mr-8 label-color"> Email </v-sheet>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field density="compact" disabled v-model="email" variant="outlined"></v-text-field></v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center" class="mb-5">
        <v-col cols="12" md="7">
          <v-card elevation="0" class="card-outlined">
            <v-toolbar color="transparent">
              <v-toolbar-title class="title-color"><v-icon start>mdi-lock</v-icon> Change
                Password</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="py-10">
              <v-form v-model="valid" ref="changePasswordForm" lazy-validation>
                <v-row dense justify="center">
                  <v-col cols="12" md="3">
                    <!-- <v-list-subheader class="d-none d-md-block">Username</v-list-subheader> -->
                    <v-sheet class="mr-8 label-color"> Username </v-sheet>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field density="compact" disabled v-model="username"
                      variant="outlined"></v-text-field></v-col>
                </v-row>
                <v-row dense justify="center">
                  <v-col cols="12" md="3">
                    <!-- <v-list-subheader class="d-none d-md-block">Email</v-list-subheader> -->
                    <v-sheet class="mr-8 label-color"> Current Password </v-sheet>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field :type="showOldPass ? 'text' : 'password'" :rules="rules.oldPwdRules"
                      v-model="oldPassword" :append-inner-icon="showOldPass ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="showOldPass = !showOldPass" density="compact"
                      variant="outlined"></v-text-field></v-col>
                </v-row>
                <v-row dense justify="center">
                  <v-col cols="12" md="3">
                    <!-- <v-list-subheader class="d-none d-md-block">Email</v-list-subheader> -->
                    <v-sheet class="mr-8 label-color"> New Password </v-sheet>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field :type="showPass ? 'text' : 'password'" hint="Password must use 6 characters or more"
                      :rules="rules.pwdRules" v-model="password"
                      :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="showPass = !showPass" density="compact"
                      variant="outlined"></v-text-field></v-col>
                </v-row>
                <v-row dense justify="center">
                  <v-col cols="12" md="3">
                    <!-- <v-list-subheader class="d-none d-md-block">Email</v-list-subheader> -->
                    <v-sheet class="mr-8 label-color">
                      Re-type Password
                    </v-sheet>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field :type="showConfPass ? 'text' : 'password'" v-model="confirmPassword"
                      :rules="rules.pwdConfirmRules" :append-inner-icon="showConfPass ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="showConfPass = !showConfPass" density="compact"
                      variant="outlined"></v-text-field></v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="py-3">
              <v-spacer></v-spacer>
              <v-btn variant="flat" :loading="loading" class="text-capitalize px-4" color="primary" :disabled="loading"
                @click="validate()"><v-icon start>mdi-content-save</v-icon> Update Password
                <template v-slot:loader>
                  <VueSpinnerIos size="20" />&nbsp;Updating...
                </template>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { VueSpinnerBounce } from "vue3-spinners";
import { useMyAuthStore } from "~/stores/auth";
import { useToast } from "vue-toastification";
const { userInfo } = storeToRefs(useMyAuthStore());
const userData = ref(userInfo?.value.user);
const token = useCookie('token')
const config = useRuntimeConfig()
const baseUrl = config.public.baseURL

const toast = useToast();
useHead({
  title: "Account",
});
const drawer = ref(true);
const tab = ref(null);
const page = ref({
  title: "Account Information",
});
const breadcrumbs = ref([
  {
    title: "Dashboard",
    disabled: false,
    to: "/",
  },
  {
    title: "Account",
    disabled: true,
  },
]);
const loader = ref(true);
const loading = ref(false);
const userDetails = ref({});
const userId = ref(null);
const username = ref("");
const facultyno = ref("");
const email = ref("");
const lastname = ref("");
const firstname = ref("");
const middlename = ref("");
const department = ref("");
const oldPassword = ref("");
const password = ref("");
const confirmPassword = ref("");
const changePasswordForm = ref(null);
const valid = ref(true);
const showOldPass = ref(false);
const showPass = ref(false);
const showConfPass = ref(false);

const rules = ref({
  oldPwdRules: [(v) => !!v || "Old password is required",],
  pwdRules: [
    (v) => !!v || "Password is required",
    (v) => (v && v.length >= 6) || "Minimum of 6 characters length",
    (v) => /[A-Z]/.test(v) || "At least one uppercase letter",
    (v) => /\d/.test(v) || "Password must have at least one number",
    // (v) =>
    //   /[!@#\$%\^&\*]/.test(v) || "Password must have at least 1 special symbol",
  ],
  pwdConfirmRules: [
    (v) => !!v || "Re-type Password is required",
    (v) => v === password.value || "Password do not match",
  ],
});

async function initialize() {
  try {
    let result = await $fetch(
      `/api/teacher-account/details/${userData.value?.teacher_id}`
    );
    if (result) {
      userDetails.value = result[0];
      email.value = result[0].email;
      username.value = result[0].faculty_no;
      facultyno.value = result[0].faculty_no;
      lastname.value = result[0].last_name;
      firstname.value = result[0].first_name;
      middlename.value = result[0].middle_name;
      department.value = result[0].department;
      loader.value = false;
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    //loading.value = false;
    throw err;
  }
}

async function validate() {
  const { valid, errors } = await changePasswordForm.value?.validate();
  if (valid) {
    loading.value = true
    const payload = {
      old_password: oldPassword.value,
      new_password: password.value,
      confirm_password: confirmPassword.value
    }
    // console.log("Password changed", payload);
    // console.log("Base Url: ", baseUrl);
    // console.log("Token", token.value)

    // const response = await fetch(`${baseUrl}/api/auth/change-password`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${token.value}`
    //   },
    //   body: JSON.stringify({
    //     currentPassword: oldPassword.value,
    //     password: password.value,
    //     passwordConfirmation: confirmPassword.value
    //   })
    // })
    // const data = await response.json();
    // console.log("Result: ", data.error)

    await fetch(`${baseUrl}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify({
        currentPassword: oldPassword.value,
        password: password.value,
        passwordConfirmation: confirmPassword.value
      })
    })
      .then(response => response.json())
      .then(data => {
        //console.log("Data:", data)
        if (data.data === null) {
          //console.log("Data 1: ", data.error.message)
          toast.error(data.error.message)

          loading.value = false;
        } else {
          //console.log("Success")
          loading.value = false;
          toast.success("Password successfully changed!");
          changePasswordForm.value?.reset();
          username.value = userDetails.value.faculty_no
        }
        //console.log("Data: ", data);
      })
      .catch(err => {
        console.log("Error: ", err)

      })

  } else {
    loading.value = false;
    toast.error(errors[0].errorMessages[0])
    console.log("Error 1: ", errors[0].errorMessages[0]);
  }
}

// const repeatPassword = computed(() => {
//   return [
//     (v) => !!v || "Re-type Password is required",
//     (v) => v === password.value || "Passwords do not match",
//   ];
// });

onMounted(async () => {
  await initialize();
});
</script>

<style scoped>
.card-outlined {
  border: 1px solid rgba(128, 128, 128, 0.274);
  border-radius: 15px;
}

.title-color {
  color: #424242;
}

.label-color {
  color: #757575;
}

.change-password {
  color: #424242;
  font-size: 19px;
  font-weight: 500;
}
</style>
