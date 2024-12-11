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
    <v-row>
      <v-col cols="12" md="3">
        <v-card elevation="0">
          <v-toolbar color="transparent" density="comfortable">
            <v-toolbar-title class="card-title text-body-1">Details
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="warning" icon size="small" variant="text" @click="updateCourseDialog = true"><v-icon
                size="large">mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Edit</v-tooltip></v-btn>
            <v-btn color="red" icon size="small" variant="text" @click="deleteCourseDialog = true"><v-icon
                size="large">mdi-delete</v-icon><v-tooltip activator="parent" location="top">Delete</v-tooltip></v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-subtitle class="title">Course & Section</v-list-item-subtitle>
              <v-list-item-title class="desc">{{
                classDetails.course_code
              }}-{{
                  classDetails.section
                }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Subject</v-list-item-subtitle>
              <v-list-item-title class="desc">{{
                classDetails.subject_code
              }} - {{ classDetails.subject_description }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Semester</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ classDetails.semester }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">School Year</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ classDetails.school_year }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Units</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ classDetails.units }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Days</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ classDetails.days }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Time</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ classDetails.time_start }} - {{ classDetails.time_end
                }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card variant="flat">
          <v-toolbar color="transparent" class="pr-3" density="comfortable">

            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" class="text-capitalize px-4" @click="addStudentDialog = true">
              <v-icon start>mdi-plus</v-icon>Add Student</v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            <v-data-table density="compact" :items="subjectList" :headers="headers" :loading="loading">
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip text="Edit" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn size="medium" variant="text" v-bind="props" @click="showUpdateSubjecyDialog(item)"
                      icon="mdi-pencil" color="green">
                    </v-btn>
                  </template>
                </v-tooltip>
                <v-tooltip text="Delete" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn size="medium" icon="mdi-delete" v-bind="props" @click="showDeleteSubjectDialog(item)"
                      variant="text" color="red"></v-btn>
                  </template>
                </v-tooltip>

                <!-- <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn> -->
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <!-- DIALOG BOX -->
    <v-dialog max-width="900" v-model="addStudentDialog" scrollable persistent>
      <v-card elevation="0">
        <v-toolbar color="primary" density="compact">
          <v-icon class="ml-4">mdi-account-group</v-icon>
          <v-toolbar-title> List of Students</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="addStudentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-title class="d-flex align-center pe-2">

          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" density="compact" label="Search" clearable prepend-inner-icon="mdi-magnify"
            variant="outlined" flat hide-details single-line></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <v-data-table density="compact" v-model:search="search" :items="studentList" :headers="studentHeaders"
            :loading="loading2">
            <template v-slot:loading2>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip text="Add Student" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn size="small" @click="addStudent(item)" class="mr-1" variant="flat" v-bind="props"
                    prepend-icon="mdi-plus" color="green">
                    Add
                  </v-btn>
                </template>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

    </v-dialog>

  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
const router = useRouter()
const route = useRoute();
const toast = useToast();
const loading = ref(true);
const loading2 = ref(true);
const search = ref(null);
// Class Details
const classDetails = ref({});
const isEmpty = ref(false);
const addStudentDialog = ref(false);
useHead({
  title: "Classes",
});
const page = ref({
  title: "Class Details",
});
const breadcrumbs = ref([
  {
    title: "Dashboard",
    disabled: false,
    to: "/",
  },
  {
    title: "Class",
    disabled: false,
    to: "/class",
  },
  {
    title: "details",
    disabled: true,
  },
]);
const headers = ref([
  {
    title: "Student No",
    sortable: true,
    key: "student_no",
  },
  { title: "Lastname", key: "last_name", sortable: false },
  { title: "Firstname", key: "first_name", sortable: false },
  { title: "Middlename", key: "middle_name", sortable: false },
  { title: "Course", key: "course", sortable: false },
  { title: "Semester", key: "semester", sortable: false },
  { title: "School Year", key: "school_year", sortable: false },
  { title: "Grade", key: "grade", sortable: false },
  { title: "Numeric", key: "numeric_grade", sortable: false },
  { title: "Remarks", key: "remarks", sortable: false },
  { title: "", key: "actions", align: "end", sortable: false },
]);

const studentHeaders = ref([
  {
    title: "Student No",
    sortable: true,
    key: "student_no",
  },
  { title: "Lastname", key: "last_name", sortable: false },
  { title: "Firstname", key: "first_name", sortable: false },
  { title: "Middlename", key: "middle_name", sortable: false },
  // { title: "Course", key: "course", sortable: false },
  { title: "Course", key: "course_code", sortable: false },
  // { title: "Major", key: "major", sortable: false },
  { title: "", key: "actions", align: "end", sortable: false },
]);
const studentList = ref([])

async function initialize() {
  try {
    let result = await $fetch(`/api/class/${route.params.id}`);

    if (result) {
      classDetails.value = result[0];
      loading.value = false;
      if (result.length == 0) {
        isEmpty.value = true;
        loading.value = false;
      }
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    loading.value = false;
    throw err;
  }
}

async function getStudentList() {
  try {
    let result = await $fetch(`/api/student/getStudentList`);

    if (result) {
      studentList.value = result;
      loading2.value = false;
    }
  } catch (err) {
    loading2.value = false;
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}
async function addStudent(item) {
  //console.log("Added Student: ", item)
  let payload = {
    class_id: route.params.id,
    student_id: item.documentId,
    student_no: item.student_no,
    subject_code: classDetails.value?.subject_code,
    course_code: item.course_code,
    course_description: item.course,
    section: classDetails.value?.section,
    units: classDetails.value?.units,
    semester: classDetails.value?.semester,
    school_year: classDetails.value?.school_year,
    grade: 0,
    numeric_grade: 0,
    remarks: '',
    teacher_id: classDetails.value?.teacher_id
  }
  console.log("Added Student: ", payload);
  await $fetch('/api/student-subject/createStudentSubject', {
    method: "POST",
    body: payload
  }).then(response => {
    if (response.status == 'fail') {
      toast.error(response.message);
    } else {
      toast.success("Successfully added.");
      initialize();
    }
  })
}

watch(addStudentDialog, async () => {
  if (addStudentDialog.value == true) {
    //console.log("Add student dialog box opened")
    await getStudentList();
  }
})

onMounted(async () => {
  await initialize();
})

</script>

<style scoped>
.errorStatus {
  color: #424242;
  font-size: 150px;
  font-weight: bold;
}

.service-notif {
  font-size: 22px;
  color: #616161;
  font-weight: bold;
}

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

.v-field__outline__start {
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.v-field__outline__end {
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
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