<template>
  <div>
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <!-- <div class="d-flex align-center justify-center" style="height: 65vh">
      <v-card class="elevation-0 text-center py-16" color="transparent">
        <v-img src="/public/maintenance.png" class="mx-auto" :width="150"></v-img>
        <div class="service-notif mt-5">Service Unavailable</div>
      </v-card>
    </div> -->
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-form ref="searchForm" v-model="search" @submit.prevent="searchStudent">
          <v-text-field variant="solo-filled" clearable v-model="searchRecord" label="Search"
            append-inner-icon="mdi-magnify" @click:append-inner="searchStudent" rounded hide-details single-line
            flat></v-text-field>
        </v-form>
      </v-col>
    </v-row>

    <v-row v-if="showResult">
      <v-col cols="12">
        <v-card elevation="0">
          <v-data-table :headers="headers" :items="searchResult" :loading="loadingTable">
            <template v-slot:loadingTable>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip text="Generate Report" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn class="text-capitalize" variant="outlined" v-bind="props" @click="generateReport(item)"
                    color="primary">
                    <template v-slot:prepend>
                      <v-icon>mdi-notebook</v-icon>
                    </template>
                    Generate
                  </v-btn>
                </template>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG BOX START -->
    <!-- Add Student Loader Dialog Box -->
    <v-dialog v-model="generateReportLoader" max-width="320" persistent>
      <v-list class="py-2" elevation="12" rounded="lg">
        <v-list-item :prepend-icon="loaderIcon" :title="loaderTitle">
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

    <!-- Student Report Card Generated Dialog Box-->
    <v-dialog v-model="generatedReportCardDialog" max-width="850" scrollable>
      <v-card elevation="0">
        <v-toolbar color="primary" density="compact">
          <v-icon class="ml-4">mdi-notebook</v-icon>
          <v-toolbar-title> Generated Report</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="generatedReportCardDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="mx-7 my-4">
          <v-row>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="4" class="text-uppercase font-weight-bold text-subtitle-2 text-green">Student No.</v-col>
                <v-col cols="1" class="font-weight-bold">:</v-col>
                <v-col cols="7" class="font-weight-bold text-subtitle-2">{{ studentno }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="4" class="text-uppercase font-weight-bold text-subtitle-2 text-green">Name</v-col>
                <v-col cols="1" class="font-weight-bold">:</v-col>
                <v-col cols="7" class="font-weight-bold text-subtitle-3 text-subtitle-2">{{ lastname }}, {{ firstname }}
                  {{
                    middlename
                  }}</v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="3" class="text-uppercase font-weight-bold text-subtitle-2 text-green">Course</v-col>
                <v-col cols="1" class="font-weight-bold">:</v-col>
                <v-col cols="8" class="font-weight-bold text-subtitle-2">{{ course }}</v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="3" class="text-uppercase font-weight-bold text-subtitle-2 text-green">Major</v-col>
                <v-col cols="1" class="font-weight-bold">:</v-col>
                <v-col cols="8" class="font-weight-bold text-subtitle-2">{{ major }}</v-col>
              </v-row>

            </v-col>
          </v-row>
        </div>
        <v-divider></v-divider>
        <div class="d-flex align-center justify-center">
          <v-btn prepend-icon="mdi-printer" variant="outlined" color="green" class="text-capitalize my-4">
            Print
          </v-btn>
        </div>
        <v-divider></v-divider>
        <v-data-table :headers="reportHeaders" :items="gradesResult">
          <template v-slot:[`item.section`]="{ item }">
           {{ item.course_code }}-{{ item.section }}
          </template>

            <template v-slot:[`item.teachers`]="{ item }">
              <v-tooltip text="Show Teacher" location="top">
              <template v-slot:activator="{ props }">
                <v-btn size="small" class="mr-2" variant="outlined" v-bind="props"
                  @click="showTeacher(item.teacher_id)" color="info">
                <v-icon>mdi-account</v-icon></v-btn>
              </template>
            </v-tooltip>
            </template>
        </v-data-table>

      </v-card>
    </v-dialog>

    <!-- DIALOG BOX END -->

  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
import { useToast } from "vue-toastification";
const { userInfo } = storeToRefs(useMyAuthStore());
const userData = ref(userInfo?.value.user);
useHead({
  title: "Reports",
});
const page = ref({
  title: "Generate Reports",
});
const breadcrumbs = ref([
  {
    title: "Dashboard",
    disabled: false,
    to: "/",
  },
  {
    title: "Reports",
    disabled: true,
  },
]);
const headers = ref([
  { title: "Student No", sortable: false, align: "start", key: "student_no" },
  { title: "Lastname", sortable: false, key: "last_name" },
  { title: "Firstname", sortable: false, key: "first_name" },
  { title: "Middlename", sortable: false, key: "middle_name" },
  { title: "Course", sortable: false, key: "course" },

  { title: "", sortable: false, align: "center", key: "actions" },
]);
const reportHeaders = ref([
  // { title: "Student No", sortable: false, align: "start", key: "student_no" },
  { title: "Section", sortable: false, align: "start", key: "section" },
  { title: "Code", sortable: false, key: "subject_code" },
  { title: "Description", sortable: false, key: "title" },
  { title: "Units", sortable: false, key: "unit" },
  { title: "Grade", sortable: false, key: "grade" },
  { title: "Numeric Grade", sortable: false, key: "numeric_grade" },
  { title: "Remarks", sortable: false, key: "remarks" },
  { title: "Teacher", sortable: false, key: "teachers" },

])
const toast = useToast();
const search = ref(null)
const loaderIcon = ref("");
const loaderTitle = ref("");
const showResult = ref(false)
const searchRecord = ref("");
const searchResult = ref([])
const generateReportLoader = ref(false);
const generatedReportCardDialog = ref(false);
const studentid = ref("");
const studentno = ref("");
const lastname = ref("");
const firstname = ref("");
const middlename = ref("");
const course = ref("");
const major = ref("")
const gradesResult = ref([])


async function searchStudent() {
  console.log("search student")
  loaderIcon.value = "mdi-magnify"
  loaderTitle.value = "Searching..."
  generateReportLoader.value = true
  try {
    if (searchRecord.value == "") {
      console.log("Empty search bar")
      searchResult.value = []
      generateReportLoader.value = false
    } else {
      let result = await $fetch(`/api/student/search?searchid=${searchRecord.value}`);
      if (result) {
        console.log(result);
        searchResult.value = result
        showResult.value = true
        generateReportLoader.value = false
      }
    }

  } catch (err) {
    generateReportLoader.value = false
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

async function generateReport(item) {
  console.log(item)
  studentid.value = item.documentId
  studentno.value = item.student_no
  lastname.value = item.last_name
  firstname.value = item.first_name
  middlename.value = item.middle_name
  course.value = item.course
  major.value = item.major
  loaderIcon.value = "mdi-notebook"
  loaderTitle.value = "Generating report..."
  generateReportLoader.value = true
  showGeneratedReport()

}

async function showGeneratedReport() {
  // generatedReportCardDialog.value = true
  // setTimeout(() => {
  //   generateReportLoader.value = false
  //   generatedReportCardDialog.value = true
  // }, 3000)

  try {
    let result = await $fetch(`/api/student-subject/show-grades/${studentid.value}`)
    if (result) {
      gradesResult.value = result;
      generateReportLoader.value = false
      generatedReportCardDialog.value = true
    }
  } catch (err) {
    generateReportLoader.value = false
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

async function showTeacher(teacherid) {
  console.log(teacherid)
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