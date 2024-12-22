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
              <v-text-field variant="outlined" label="Middlename" placeholder="Optional" v-model="middlename"
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
        <v-data-table :headers="headers" :items="teachersAccountList" :loading="loadingTable">
          <template v-slot:loadingTable>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip text="Edit Account" location="top">
              <template v-slot:activator="{ props }">
                <v-btn size="medium" class="mr-2" variant="text" v-bind="props" icon="mdi-pencil"
                  @click="showUpdateTechearAccountDialog(item)" color="orange"></v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Delete Account" location="top">
              <template v-slot:activator="{ props }">
                <v-btn size="medium" variant="text" v-bind="props" icon="mdi-delete" color="red" @click="deleteTeacherAccountDialog = true"></v-btn>
              </template>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- DIALOG BOX -->
    <!-- Update Teacher Account Dialog -->
    <v-dialog max-width="400" v-model="updateTeacherAccountDialog" scrollable persistent>
      <v-card elevation="0">
        <v-toolbar color="primary" density="compact">
          <v-icon class="ml-4">mdi-text-box-check</v-icon>
          <v-toolbar-title> Update Account</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="updateTeacherAccountDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="valid" fast-fail ref="updateTeacherAccountForm" lazy-validation>
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field variant="outlined" label="Faculty No" v-model="facultyno_update" :rules="rules.facultyno"
                  @input="facultyno = facultyno.toUpperCase()"></v-text-field>
              </v-col>
              <v-col cols="12"><v-text-field variant="outlined" label="Lastname" v-model="lastname_update"
                  :rules="rules.lastname" @input="lastname_update  = lastname_update.toUpperCase()"></v-text-field></v-col>
              <v-col cols="12"><v-text-field variant="outlined" label="Firstname" v-model="firstname_update" :rules="rules.firstname"
                @input="firstname_update = firstname_update.toUpperCase()"></v-text-field></v-col>
              <v-col cols="12"><v-text-field variant="outlined" label="Middlename" placeholder="Optional" v-model="middlename_update"
                @input="middlename_update = middlename_update.toUpperCase()"></v-text-field></v-col>
              <v-col cols="12"><v-text-field variant="outlined" label="Email" v-model="email_update" :rules="rules.email"></v-text-field></v-col>
              <v-col cols="12">
                <v-select variant="outlined" label="Gender" :items="['MALE', 'FEMALE']" v-model="gender_update"
                :rules="rules.gender"></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="mx-4">
          <v-btn color="primary" variant="flat" block @click="updateTeacherAccount()">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Teacher Account Dialog -->
     <v-dialog width="auto" v-model="deleteTeacherAccountDialog">
        <v-card min-width="300" class="py-4 text-center">
          <v-card-text>
            <v-icon size="60">mdi-alert</v-icon>
          <p class="mt-3">Service Unavailable</p>
          </v-card-text>
          
        </v-card>
     </v-dialog>
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
  { title: "Faculty No", sortable: false, align: "start", key: "faculty_no" },
  { title: "Lastname", sortable: false, key: "last_name" },
  { title: "Firstname", sortable: false, key: "first_name" },
  { title: "Middlename", sortable: false, key: "middle_name" },
  { title: "Email", sortable: false, key: "email" },
  { title: "Gender", sortable: false, key: "gender" },
  { title: "", sortable: false, key: "actions" },
]);

const rules = ref({
  facultyno: [(v) => !!v || "Faculty no is required"],
  lastname: [(v) => !!v || "Faculty no is required"],
  firstname: [(v) => !!v || "Faculty no is required"],
  middlename: [(v) => !!v || "Faculty no is required"],
  email: [
    (v) => !!v || "Faculty no is required",
    (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
  ],
  gender: [(v) => !!v || "Faculty no is required"],
});

// DATA
const createAccountForm = ref(null);
const valid = ref(true);
const loading = ref(false);
const loadingTable = ref(true);
const facultyno = ref("");
const lastname = ref("");
const firstname = ref("");
const middlename = ref("");
const email = ref("");
const gender = ref("");
// Data for fetching list of teacher's account
const teachersAccountList = ref([]);
// Data for updating teacher's account
const updateTeacherAccountDialog = ref(false);
const teacherid = ref("");
const facultyno_update = ref("");
const lastname_update = ref("");
const firstname_update = ref("");
const middlename_update = ref("");
const email_update = ref("");
const gender_update = ref("");
// Data for deleting teacher account
const deleteTeacherAccountDialog = ref(false);

async function initialize() {
  try {
    let result = await $fetch(
      `/api/teacher-account/list/${userData.value.department}`
    );
    if (result) {
      teachersAccountList.value = result;
      loadingTable.value = false;
    }
  } catch (er) {
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

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
      role_view: "teacher",
    };

    console.log(payload);
    await $fetch("/api/teacher-account/create", {
      method: "POST",
      body: payload,
    }).then((response) => {
      if (response.status == "fail") {
        toast.error(response.message);
        loading.value = false;
      } else {
        toast.success("Account successfully created.");
        createAccountForm.value?.reset();
        initialize();
        loading.value = false;
      }
    });
    // setTimeout(() => {
    //   createAccountForm.value?.reset();
    //   loading.value = false
    // }, 3000)
  }
}

async function showUpdateTechearAccountDialog(item) {
  console.log("Show Update Teacher Account Dialog", item);
  updateTeacherAccountDialog.value = true;
  teacherid.value = item.teacher_id
  facultyno_update.value = item.faculty_no
  lastname_update.value = item.last_name
  firstname_update.value = item.first_name
  middlename_update.value = item.middle_name
  email_update.value = item.email
  gender_update.value = item.gender
}

async function updateTeacherAccount() {
    
    let payload = {
      teacher_id: teacherid.value,
      faculty_no: facultyno_update.value,
      last_name: lastname_update.value,
      first_name: firstname_update.value,
      middle_name: middlename_update.value,
      email: email_update.value,
      gender: gender_update.value
    };
    console.log("Successfully updated ", payload)
}

onMounted(async () => {
  await initialize();
});

watch(updateTeacherAccountDialog, async () => {
  if (updateTeacherAccountDialog.value == false) {
    console.log("Update Teacher Account Dialog Closed")
  }
})
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
