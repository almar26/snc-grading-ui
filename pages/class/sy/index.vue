<template>
  <div>
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <!-- <v-card variant="flat">

      <v-data-table density="compact" :items="studentSubjectList" :headers="headers" :loading="loading">
            
          </v-data-table>
    </v-card> -->
    <v-skeleton-loader v-if="loader" class="mx-auto" elevation="0" color="transparent" :loading="loader"
      type="article, list-item-two-line">
    </v-skeleton-loader>
    <v-row no-gutters v-else>
      <v-col cols="12">
        <v-card elevation="0" class="mb-2">
          <v-toolbar density="comfortable" color="white" class="px-4">
            <v-icon>mdi-folder</v-icon>
            <v-toolbar-title>{{ route.query.semester }}</v-toolbar-title>
            <!-- <v-spacer></v-spacer><v-btn class="text-capitalize" variant="elevated" prepend-icon="mdi-plus"
              color="primary" @click="showAddCourseDialog()">Create Class</v-btn> -->
          </v-toolbar>
        </v-card>
        <v-card v-if="noData" elevation="0" class="text-center d-flex align-center justify-center">
          <v-card-text class="py-15">
            <v-icon size="70" color="grey-darken-1">mdi-information-outline</v-icon>
            <h2 class="text-grey-darken-1">No Data Available</h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" v-for="item in classList" :key="item.id">
        <v-card elevation="0" class="c-card mb-2" @click="openViewClassDialog(item)" :loading="false">
          <v-row no-gutters>
            <v-col cols="2" md="1">
              <v-sheet height="80" class="d-flex align-center justify-center">
                <v-avatar>
                  <v-icon size="35">mdi-file</v-icon>
                </v-avatar>
              </v-sheet>
            </v-col>
            <v-col cols="10" md="4" class="pl-5">
              <div class="c-name mt-3">{{ item.subject_code }}</div>
              <div class="c-brgy mb-3">
                {{ item.subject_description }}
              </div>
            </v-col>
            <v-col cols="12" md="1"> </v-col>
            <v-col cols="12" md="5">
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-left title-table">Course & Section</th>
                    <th class="text-left title-table">Semester</th>
                    <th class="text-left title-table">School Year</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="value-table">
                      {{ item.course_code }}-{{ item.section }}
                    </td>
                    <td class="value-table">{{ item.semester }}</td>
                    <td class="value-table">{{ item.school_year }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
            <v-col cols="12" md="1">
              <v-sheet height="80" class="d-flex align-center justify-center">
                <v-icon v-if="item.finalize == true" color="success" size="60">mdi-check-circle-outline</v-icon>
                <v-icon v-else color="#E0E0E0" size="60">mdi-check-circle-outline</v-icon>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- View Class Dialog -->
    <v-dialog v-model="viewClassDialog" max-width="900" scrollable persistent>
      <v-card elevation="0">
        <v-toolbar color="primary" density="compact">
          <v-icon class="ml-4">mdi-text-box-check</v-icon>
          <v-toolbar-title> {{ subjectCode }} Class</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="viewClassDialog = false">
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

        <!-- <v-data-table density="compact" :items="studentSubjectList" :headers="classHeaders" :loading="loading2">
            <template v-slot:[`item.actions`]="{ item }" v-if="finalizeClass == null || finalizeClass == false">
              <v-tooltip text="Input Grade" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn size="medium" variant="text" v-bind="props" @click="showUpdateGradeDialog(item)"
                    color="primary">
                    <v-icon size="30">mdi-text-box-check</v-icon>
                  </v-btn>
                </template>
</v-tooltip>
</template>
</v-data-table> -->

        <v-data-table class="table-2" density="compact" :items="studentSubjectList" :headers="classHeaders"
          :loading="loading2"></v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
const { userInfo } = storeToRefs(useMyAuthStore());
const userData = ref(userInfo?.value.user);
const route = useRoute();

useHead({
  title: "Previous Classes",
});
const page = ref({
  title: `School Year: ${route.query.school_year}`,
});
const breadcrumbs = ref([
  {
    title: "Dashboard",
    disabled: false,
    to: "/",
  },
  {
    title: "Classes",
    disabled: false,
    to: "/class",
  },
  {
    title: `${route.query.school_year}(${route.query.semester})`,
    disabled: true,
  },
]);

const headers = ref([
  {
    title: "Subject Code",
    sortable: true,
    key: "student_no",
  },
  { title: "Subject Description", key: "last_name", sortable: false },
  { title: "Course & Section", key: "first_name", sortable: false },
  { title: "Semester", key: "middle_name", sortable: false },
  { title: "School Year", key: "course_code", sortable: false },

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
  { title: "Grade", key: "grade", sortable: false },
  { title: "Numeric", key: "numeric_grade", sortable: false },
  { title: "Remarks", key: "remarks", sortable: false },
  { title: "", key: "actions", align: "end", sortable: false },
]);
const loading = ref(true);
const loading2 = ref(true);
const studentSubjectList = ref([]);
const classList = ref([]);
const loader = ref(true);
const noData = ref(false);
const viewClassDialog = ref(false);
const classid = ref("");
const subjectCode = ref("");
const subjectDesc = ref("");
const courseCode = ref("");
const section = ref("");
const finalizeClass = ref(null);

async function initialize() {
  try {
    let result = await $fetch(
      `/api/class/getClassList?teacher_id=${userData.value.teacher_id}&sy=${route.query.school_year}&semester=${route.query.semester}`
    );
    if (result) {
      //console.log("List: ", result);
      classList.value = result;
      loader.value = false;
      noData.value = false;
      if (result.length == 0) {
        noData.value = true;
        console.log("No data available");
      }
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

async function openViewClassDialog(item) {
  //console.log(item)
  classid.value = item.documentId;
  subjectCode.value = item.subject_code;
  subjectDesc.value = item.subject_description;
  courseCode.value = item.course_code;
  section.value = item.section;
  finalizeClass.value = item.finalize;
  viewClassDialog.value = true;
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
  await initialize();
});
</script>

<style scoped>
.order-card {
  border-radius: 0;
  height: 110px;
}

.btn-check {
  border-radius: 0;
  height: 78px !important;
  width: 50px;
}

.c-card:hover {
  /* border: 1px solid #024650; */
  /* margin-top: 10px; */
  box-shadow: 1px 1px 18px -1px #888888 !important;
}

/* .c-card:visited {
  height: 400px;
} */

.c-number {
  font-size: 40px;
  color: red;
  text-align: center;
  font-weight: bold;
}

.c-name {
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
}

.c-brgy {
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  color: #575757;
}

.c-name-dialog {
  font-size: 25px;
  font-weight: bold;
  text-transform: uppercase;
  padding-left: 10px;
}

.c-number-dialog {
  font-size: 70px;
  color: red;
  text-align: right;
  font-weight: bold;
}

.c-address-dialog {
  font-size: 15px;
  font-weight: bold;
  padding-left: 10px;
  color: #575757;
}

.btn-submit {
  height: 40px !important;
  width: 100px !important;
}

.title-table {
  font-size: 12px !important;
  font-weight: bold !important;
}

.value-table {
  font-size: 13px !important;
}

:deep() .table-2 .v-table__wrapper>table>thead>tr>th {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-bottom: thick solid rgba(var(--v-border-color), var(--v-border-opacity));
  font-weight: bold;
  /* background-color: #04aa6d;
  color: white; */
}

:deep() .table-2 .v-table__wrapper>table>tbody>tr>td:not(:last-child),
.table-2 .v-table__wrapper>table>tbody>tr>th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep() .table-2 .v-table__wrapper>table>tbody>tr:nth-child(even) {
  background-color: #f2f2f2;
}

:deep() .table-2 .v-table__wrapper>table>tbody>tr:hover {
  background-color: #f2f2f2;
}
</style>
