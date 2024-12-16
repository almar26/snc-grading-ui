<template>
  <div>
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <!-- <div class="d-flex align-center justify-center" style="height: 80vh">
      <v-card class="elevation-0 text-center py-16" color="transparent">
        <v-img
          src="/public/maintenance.png"
          class="mx-auto"
          :width="150"
        ></v-img>
        <div class="service-notif mt-5">Service Unavailable</div>
      </v-card>
    </div> -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-toolbar color="transparent">
            <v-toolbar-title>Create new account</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            <v-form v-model="valid" ref="createAccountForm" lazy-validation @submit.prevent="createAccount">
              <v-text-field variant="outlined" label="Faculty No" v-model="facultyno" :rules="rules.facultyno"
                @input="facultyno = facultyno.toUpperCase()"></v-text-field>
              <v-text-field variant="outlined" label="Lastname" v-model="lastname" :rules="rules.lastname"
                @input="lastname = lastname.toUpperCase()"></v-text-field>
              <v-text-field variant="outlined" label="Firstname" v-model="firstname" :rules="rules.firstname"
                @input="firstname = firstname.toUpperCase()"></v-text-field>
              <v-text-field variant="outlined" label="Middlename" v-model="middlename" :rules="rules.middlename"
                @input="middlename = middlename.toUpperCase()"></v-text-field>
              <v-text-field variant="outlined" label="Email" v-model="email" :rules="rules.email"></v-text-field>
              <v-select variant="outlined" label="Gender" :items="['MALE', 'FEMALE']" v-model="gender"
                :rules="rules.gender"></v-select>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" variant="flat" block :disabled="!valid" @click="createAccount()"
              :loading="loading">Create Account</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-data-table :headers="headers" :loading="loadingTable">
          <template v-slot:loadingTable>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
const { userInfo } = storeToRefs(useMyAuthStore());
const userData = ref(userInfo?.value.user);
const toast = useToast();
const page = ref({
  title: "Teachers",
});
const breadcrumbs = ref([
  {
    title: "Dashboard",
    disabled: false,
    to: "/",
  },
  {
    title: "Teachers",
    disabled: true,
  },
]);

const headers = ref([
  { title: 'Faculty No', sortable: false, align: "start", key: 'faculty_no' },
  { title: 'Lastname', sortable: false, key: 'last_name' },
  { title: 'Firstname', sortable: false, key: 'first_name' },
  { title: 'Middlename', sortable: false, key: 'middle_name' },
  { title: 'Email', sortable: false, key: 'email' },
  { title: 'Gender', sortable: false, key: 'gender' },
])

const rules = ref({
  facultyno: [v => !!v || 'Faculty no is required'],
  lastname: [v => !!v || 'Faculty no is required'],
  firstname: [v => !!v || 'Faculty no is required'],
  middlename: [v => !!v || 'Faculty no is required'],
  email: [v => !!v || 'Faculty no is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid',],
  gender: [v => !!v || 'Faculty no is required'],
})

// DATA
const createAccountForm = ref(null);
const valid = ref(true);
const loading = ref(false);
const loadingTable = ref(false);
const facultyno = ref("");
const lastname = ref("");
const firstname = ref("");
const middlename = ref("");
const email = ref("");
const gender = ref("");

async function createAccount() {
  const { valid, errors } = await createAccountForm.value?.validate();
  loading.value = true;
  if (valid) {
    let payload = {
      faculty_no: facultyno.value,
      last_name: lastname.value,
      first_name: firstname.value,
      middle_name: middlename.value,
      email: email.value,
      gender: gender.value,
      department: userData.value.department,
      birthday: "",
      teacher_status: "active",
      role_view: "teacher"
    };

    console.log(payload);
    await $fetch("/api/teacher-account/create", {
      method: "POST",
      body: payload
    }).then(response => {
      if (response.status == "fail") {
        toast.error(response.message);
        loading.value = false;
      } else {
        toast.success("Account successfully created.");
        createAccountForm.value?.reset();
        loading.value = false;
      }
    })
    // setTimeout(() => {
    //   createAccountForm.value?.reset();
    //   loading.value = false
    // }, 3000)
  }
}
</script>

<style scoped>
:deep() .v-table .v-table__wrapper>table>thead>tr>th {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-bottom: thick solid rgba(var(--v-border-color), var(--v-border-opacity));
  font-weight: bold;
  /* background-color: #04aa6d;
  color: white; */
}

:deep() .v-table .v-table__wrapper>table>tbody>tr>td:not(:last-child),
.v-table .v-table__wrapper>table>tbody>tr>th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep() .v-table .v-table__wrapper>table>tbody>tr:nth-child(even) {
  background-color: #f2f2f2;
}

:deep() .v-table .v-table__wrapper>table>tbody>tr:hover {
  background-color: #f2f2f2;
}
</style>
