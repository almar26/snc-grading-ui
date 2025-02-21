<template>
  <div class="d-flex align-center justify-center" style="height: 60vh" v-if="isEmpty">
    <v-card class="elevation-0 text-center py-16" color="transparent">
      <!-- <v-icon size="80" color="warning">mdi-alert-outline</v-icon> -->
      <!-- <v-img src="/public/maintenance.png" class="mx-auto" :width="150"></v-img> -->
      <p class="errorStatus">404</p>
      <div class="service-notif">Oops! Something is missing</div>
      <!-- <v-btn color="primary" class="mt-3" width="150" variant="outlined" @click="$router.back()" rounded>Go Back</v-btn> -->
      <v-btn color="primary" class="mt-3" width="150" variant="outlined" to="/class" rounded>Go Back</v-btn>
    </v-card>
  </div>
  <div v-else>
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <div class="d-flex align-center justify-center" style="height: 60vh" v-if="loader">
      <v-card class="elevation-0 text-center py-16" color="transparent">
        <v-progress-circular :size="70" :width="7" indeterminate></v-progress-circular>
        <div class="service-notif mt-5">Loading....</div>
      </v-card>
    </div>
    <v-row v-else>
      <v-col cols="12" md="3">
        <v-card elevation="0">
          <v-toolbar color="transparent" density="comfortable">
            <v-toolbar-title class="card-title text-body-1">Details
            </v-toolbar-title>


          </v-toolbar>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-subtitle class="title">Faculty No</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ teacherDetails.faculty_no }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Faculty Name</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ teacherDetails.last_name }}, {{ teacherDetails.first_name }} {{
                teacherDetails.middle_name }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Email</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ teacherDetails.email }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Gender</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ teacherDetails.gender }}</v-list-item-title>
            </v-list-item>
          </v-list>

        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card variant="flat">


          <v-data-table density="compact" :items="classList" :headers="headers" :loading="loading">
            <template v-slot:[`item.course`]="{ item }">
              {{ item.course_code }}-{{ item.section }}
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-chip class="ma-2" color="warning" label v-if="item.finalize == null || item.finalize == false">
                <v-icon icon="mdi-information" start></v-icon>
                Unfinalize
              </v-chip>
              <v-chip class="ma-2" color="green" label v-else>
                <v-icon icon="mdi-check-circle" start></v-icon>
                Finalized
              </v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip text="View Class" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn size="medium" variant="text" v-bind="props" @click="openViewClassDialog(item)"
                    color="primary">
                    <v-icon size="25">mdi-open-in-new</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG BOX -->
    <!-- Loader Dialog box -->
    <v-dialog v-model="loaderDialog" max-width="320" persistent>
      <v-list class="py-2" color="primary" elevation="12" rounded="lg">
        <v-list-item prepend-icon="mdi-account" title="Adding student...">
          <template v-slot:prepend>
            <div class="pe-4">
              <v-icon color="primary" size="x-large"></v-icon>
            </div>
          </template>

          <template v-slot:append>
            <v-progress-circular color="primary" indeterminate="disable-shrink" size="16"
              width="2"></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>

    <v-dialog v-model="vieClassDialog" max-width="900" persistent>
      <v-card elevation="0">
        <v-toolbar color="primary" density="compact">
          <v-icon class="ml-4">mdi-text-box-check</v-icon>
          <v-toolbar-title> {{ subjectCode }} Class</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="vieClassDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="mx-7 my-4">
          <v-row no-gutters>
            <v-col cols="2" class="text-uppercase font-weight-bold text-subtitle-2 text-green">Subject</v-col>
            <v-col cols="1" class="font-weight-bold">:</v-col>
            <v-col cols="9" class="font-weight-bold">{{ subjectCode }}-{{ subjectDesc }}</v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="2" class="text-uppercase font-weight-bold text-subtitle-2 text-green">Section</v-col>
            <v-col cols="1" class="font-weight-bold">:</v-col>
            <v-col cols="9" class="font-weight-bold text-subtitle-3">{{ courseCode }}-{{ section }}</v-col>
          </v-row>
        </div>
        <v-divider></v-divider>
        <v-card-text>
          <v-data-table density="compact" :items="studentSubjectList" :headers="classHeaders" :loading="loading2">            
          </v-data-table>
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
const router = useRouter();
const route = useRoute();
const toast = useToast();
const page = ref({
  title: "List of Classes",
});
const breadcrumbs = ref([
  {
    title: "Dashboard",
    disabled: false,
    to: "/",
  },
  {
    title: "Teachers",
    disabled: false,
    to: "/teachers"
  },
  {
    title: "Classes",
    disabled: true,
  },
]);
const headers = ref([
  {
    title: "Subject Code",
    sortable: true,
    key: "subject_code",
  },
  { title: "Subject Description", key: "subject_description", sortable: false },
  { title: "Course & Section", key: "course", sortable: false },
  { title: "Semester", key: "semester", sortable: false },
  { title: "School Year", key: "school_year", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "", key: "actions", align: "end", sortable: false },
]);
const classHeaders = ref([
  {
    title: "Student No",
    sortable: true,
    key: "student_no",
  },
  { title: "Lastname", key: "last_name", sortable: false },
  { title: "Firstname", key: "first_name", sortable: false },
  { title: "Middlename", key: "middle_name", sortable: false },
  // { title: "Course", key: "course_code", sortable: false },
  // { title: "Semester", key: "semester", sortable: false },
  // { title: "School Year", key: "school_year", sortable: false },
  { title: "Grade", key: "grade", sortable: false },
  { title: "Numeric", key: "numeric_grade", sortable: false },
  { title: "Remarks", key: "remarks", sortable: false },
  
]);

const isEmpty = ref(false);
const loading = ref(true);
const loading2 = ref(true);
const loaderDialog = ref(false);
const loader = ref(true);
const teacherDetails = ref({})
const classList = ref([]);
const semester = ref("");
const schoolYear = ref("");
const vieClassDialog = ref(false);
const classid = ref("");
const subjectCode = ref("");
const subjectDesc = ref("");
const courseCode = ref("");
const section = ref("");
const studentSubjectList = ref([]);


async function initialize() {
  try {
    let result = await $fetch(`/api/teacher-account/details/${route.params.id}`);
    if (result) {
      if (result.length == 0) {
        isEmpty.value = true;
      } else {
        loader.value = false;
        //console.log(result[0])
        teacherDetails.value = result[0]
      }
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    loading.value = false;
    throw err;
  }
}

// Get Active School Year
async function getActiveSchoolyear() {
  try {
    let result = await $fetch("/api/school-year/getActiveSchoolYear");

    if (result) {
      semester.value = result[0].semester
      schoolYear.value = result[0].school_year;
      //console.log("Active School Year: ", result[0])
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

// Get list of classes of the faculty
async function getFacultyClasses() {
  try {
    let result = await $fetch(
      `/api/class/getClassList?teacher_id=${route.params.id}&sy=${schoolYear.value}&semester=${semester.value}`
    );
    if (result) {
      //console.log("List: ", result);
      classList.value = result;
      loader.value = false;
      loading.value = false;
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

// Open View Class Dialog
async function openViewClassDialog(item) {
  //console.log(item)
  classid.value = item.documentId;
  subjectCode.value = item.subject_code;
  subjectDesc.value = item.subject_description;
  courseCode.value = item.course_code;
  section.value = item.section;
  vieClassDialog.value = true
  getStudentSubjectList();
}

async function getStudentSubjectList() {
  try {
    let result = await $fetch(`/api/student-subject/list/${classid.value}`);
    if (result) {
      studentSubjectList.value = result;
      loading2.value = false;
      //addStudentLoader.value = false;
    }
  } catch (err) {
    loading.value = false;
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

onMounted(async () => {
  await getActiveSchoolyear();
  await initialize()
  await getFacultyClasses()
})
</script>

<style scoped>
.card-title {
  font-weight: bold;
}

.title {
  font-weight: bold;
  margin-bottom: 2px;
  font-size: 12px;
}

.desc {
  font-size: 14px;
  font-weight: bold;
}

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