<template>
  <div>
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row justify="center">
      <v-col cols="12" md="7">
        <v-card elevation="0" class="card-outlined">
          <v-toolbar color="transparent">
            <v-toolbar-title class="title-color"><v-icon start>mdi-account-circle</v-icon> Profile Information</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text class="py-10">
            <v-row dense justify="center">
              <v-col cols="12" md="3">
                <!-- <v-list-subheader class="d-none d-md-block">Email</v-list-subheader> -->
                <v-sheet class="mr-8 label-color">
                  Faculty No
                </v-sheet>
              </v-col>
              <v-col cols="12" md="8"> <v-text-field density="compact" disabled v-model="facultyno"
                  variant="outlined"></v-text-field></v-col>
            </v-row>
           
            <v-row dense justify="center">
              <v-col cols="12" md="3">
                <v-sheet class="mr-8 label-color">
                  Last name
                </v-sheet>
              </v-col>
              <v-col cols="12" md="8"> <v-text-field density="compact" disabled v-model="lastname"
                  variant="outlined"></v-text-field></v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col cols="12" md="3">
                <v-sheet class="mr-8 label-color">
                  First name
                </v-sheet>
              </v-col>
              <v-col cols="12" md="8"> <v-text-field density="compact" disabled v-model="firstname"
                  variant="outlined"></v-text-field></v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col cols="12" md="3">
                <v-sheet class="mr-8 label-color">
                  Middle name
                </v-sheet>
              </v-col>
              <v-col cols="12" md="8"> <v-text-field density="compact" disabled v-model="middlename"
                  variant="outlined"></v-text-field></v-col>
            </v-row>

            <v-row dense justify="center">
              <v-col cols="12" md="3">
                <v-sheet class="mr-8 label-color">
                  Department
                </v-sheet>
              </v-col>
              <v-col cols="12" md="8"> <v-text-field density="compact" disabled v-model="department"
                  variant="outlined"></v-text-field></v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col cols="12" md="3">
                <!-- <v-list-subheader class="d-none d-md-block">Email</v-list-subheader> -->
                <v-sheet class="mr-8 label-color">
                  Email
                </v-sheet>
              </v-col>
              <v-col cols="12" md="8"> <v-text-field density="compact" disabled v-model="email"
                  variant="outlined"></v-text-field></v-col>
            </v-row>

          </v-card-text>

        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="7">
        <v-card elevation="0" class="card-outlined">
          <v-toolbar color="transparent">
            <v-toolbar-title class="title-color"><v-icon start>mdi-lock</v-icon> Change Password</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text class="py-10">
            <v-row dense justify="center">
              <v-col cols="12" md="3">
                <!-- <v-list-subheader class="d-none d-md-block">Username</v-list-subheader> -->
                <v-sheet class="mr-8 label-color">
                  Username
                </v-sheet>
              </v-col>
              <v-col cols="12" md="8"> <v-text-field density="compact" disabled v-model="username"
                  variant="outlined"></v-text-field></v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col cols="12" md="3">
                <!-- <v-list-subheader class="d-none d-md-block">Email</v-list-subheader> -->
                <v-sheet class="mr-8 label-color">
                  New Password
                </v-sheet>
              </v-col>
              <v-col cols="12" md="8"> <v-text-field type="password" density="compact"
                  variant="outlined"></v-text-field></v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col cols="12" md="3">
                <!-- <v-list-subheader class="d-none d-md-block">Email</v-list-subheader> -->
                <v-sheet class="mr-8 label-color">
                  Re-type Password
                </v-sheet>
              </v-col>
              <v-col cols="12" md="8"> <v-text-field type="password" density="compact"
                  variant="outlined"></v-text-field></v-col>
            </v-row>
            <!-- <v-row dense justify="center">
              <v-col cols="12" md="3">
              
              </v-col>
              <v-col cols="12" md="8" class="text-center"> 
                <v-btn color="primary" width="100" variant="flat"><v-icon start>mdi-content-save</v-icon> Save</v-btn>
              </v-col>
            </v-row> -->
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="py-3">
            <v-spacer></v-spacer>
            <v-btn width="100" variant="flat" class="text-capitalize" color="primary"><v-icon start>mdi-content-save</v-icon> Save</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </div>


</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
const { userInfo } = storeToRefs(useMyAuthStore());
const userData = ref(userInfo?.value.user);
useHead({
  title: "Account",
});
const drawer = ref(true)
const tab = ref(null)
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
const userDetails = ref({})
const username = ref("")
const facultyno = ref("")
const email = ref("")
const lastname = ref("")
const firstname = ref("")
const middlename = ref("")
const department = ref("")

async function initialize() {
  try {
    let result = await $fetch(`/api/teacher-account/details/${userData.value?.teacher_id}`);
    if (result) {
      userDetails.value = result[0]
      email.value = result[0].email
      username.value = result[0].faculty_no
      facultyno.value = result[0].faculty_no
      lastname.value = result[0].last_name
      firstname.value = result[0].first_name
      middlename.value = result[0].middle_name
      department.value = result[0].department
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    //loading.value = false;
    throw err;
  }
}



onMounted(async () => {
  await initialize();
})
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