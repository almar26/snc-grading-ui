<template>
  <div
    class="d-flex align-center justify-center"
    style="height: 60vh"
    v-if="isEmpty"
  >
    <v-card class="elevation-0 text-center py-16" color="transparent">
      <!-- <v-icon size="80" color="warning">mdi-alert-outline</v-icon> -->
      <!-- <v-img src="/public/maintenance.png" class="mx-auto" :width="150"></v-img> -->
      <p class="errorStatus">404</p>
      <div class="service-notif">Oops! Something is missing</div>
      <!-- <v-btn color="primary" class="mt-3" width="150" variant="outlined" @click="$router.back()" rounded>Go Back</v-btn> -->
      <v-btn
        color="primary"
        class="mt-3"
        width="150"
        variant="outlined"
        to="/class"
        rounded
        >Go Back</v-btn
      >
    </v-card>
  </div>
  <div v-else>
    <BaseBreadcrumb
      :title="page.title"
      :icon="page.icon"
      :breadcrumbs="breadcrumbs"
    ></BaseBreadcrumb>
    <div
      class="d-flex align-center justify-center"
      style="height: 60vh"
      v-if="loader"
    >
      <v-card class="elevation-0 text-center py-16" color="transparent">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
        ></v-progress-circular>
        <div class="service-notif mt-5">Loading....</div>
      </v-card>
    </div>
    <v-row v-else>
      <v-col cols="12" md="3">
        <v-card elevation="0">
          <v-toolbar color="transparent" density="comfortable">
            <v-toolbar-title class="card-title text-body-1"
              >Details
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              icon
              size="small"
              variant="text"
              @click="updateCourseDialog = true"
              ><v-icon size="large">mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top"
                >Edit</v-tooltip
              ></v-btn
            >
            <v-btn
              color="red"
              icon
              size="small"
              variant="text"
              @click="deleteCourseDialog = true"
              ><v-icon size="large">mdi-delete</v-icon
              ><v-tooltip activator="parent" location="top"
                >Delete</v-tooltip
              ></v-btn
            >
          </v-toolbar>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-subtitle class="title"
                >Course & Section</v-list-item-subtitle
              >
              <v-list-item-title class="desc"
                >{{ classDetails.course_code }}-{{
                  classDetails.section
                }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Subject</v-list-item-subtitle>
              <v-list-item-title class="desc"
                >{{ classDetails.subject_code }} -
                {{ classDetails.subject_description }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title"
                >Semester</v-list-item-subtitle
              >
              <v-list-item-title class="desc">{{
                classDetails.semester
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title"
                >School Year</v-list-item-subtitle
              >
              <v-list-item-title class="desc">{{
                classDetails.school_year
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Units</v-list-item-subtitle>
              <v-list-item-title class="desc">{{
                classDetails.units
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Days</v-list-item-subtitle>
              <v-list-item-title class="desc">{{
                classDetails.days
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Time</v-list-item-subtitle>
              <v-list-item-title class="desc"
                >{{ classDetails.time_start }} -
                {{ classDetails.time_end }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card variant="flat">
          <v-toolbar color="transparent" class="pr-3" density="comfortable">
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="primary"
              class="text-capitalize px-4"
              @click="addStudentDialog = true"
            >
              <v-icon start>mdi-plus</v-icon>Add Student</v-btn
            >
          </v-toolbar>
          <v-divider></v-divider>

          <v-data-table
            density="compact"
            :items="studentSubjectList"
            :headers="headers"
            :loading="loading"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip text="Input Grade" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    size="medium"
                    variant="text"
                    v-bind="props"
                    @click="showUpdateGradeDialog(item)"
                    color="primary"
                  >
                    <v-icon size="30">mdi-text-box-check</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Delete" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    size="medium"
                    v-bind="props"
                    @click="showDeleteGradeDialog(item)"
                    variant="text"
                    color="red"
                  >
                    <v-icon size="30">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <!-- <v-tooltip text="Finalize" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      size="medium"
                      v-bind="props"
                      @click="showDeleteSubjectDialog(item)"
                      variant="text"
                      color="green"
                      class="ml-4"
                    >
                      <v-icon size="30">mdi-check-circle</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip> -->

              <!-- <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn> -->
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG BOX -->
    <!-- Add student dialog -->
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
          <v-text-field
            v-model="search"
            density="compact"
            label="Search"
            clearable
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            flat
            hide-details
            single-line
          ></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <v-data-table
            density="compact"
            v-model:search="search"
            :items="studentList"
            :headers="studentHeaders"
            :loading="loading2"
          >
            <template v-slot:loading2>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip text="Add Student" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    size="small"
                    @click="addStudent(item)"
                    class="mr-1"
                    variant="flat"
                    v-bind="props"
                    prepend-icon="mdi-plus"
                    color="green"
                  >
                    Add
                  </v-btn>
                </template>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Add grade dialog -->
    <v-dialog max-width="500" v-model="updateGradeDialog" scrollable persistent>
      <v-card elevation="0">
        <v-toolbar color="primary" density="compact">
          <v-icon class="ml-4">mdi-text-box-check</v-icon>
          <v-toolbar-title> Update Grade</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="updateGradeDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="mx-7 my-4">
          <v-row no-gutters>
            <v-col cols="4" class="text-uppercase font-weight-bold text-subtitle-2">Student No.</v-col>
            <v-col cols="8" class="text-subtitle-2">: {{ studentno }}</v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="4" class="text-uppercase font-weight-bold text-subtitle-2">Name</v-col>
            <v-col cols="8" class="text-subtitle-2">: {{ lastname }}, {{ firstname }} {{ middlename }}</v-col>
          </v-row>
        </div>
        <v-divider></v-divider>
        <v-card-text>
          <v-form v-model="valid" fast-fail ref="addGradeForm" lazy-validation>
            <v-row dense>
              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field
                  label="Grade"
                  v-model="grade"
                  variant="outlined"
                  type="number"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field
                  label="Numeric Grade"
                  v-model="numericGrade"
                  variant="outlined"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field
                  label="Remarks"
                  v-model="remarks"
                  variant="outlined"
                  @input="remarks = remarks.toUpperCase()"
                  required
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label class="label mb-4" for="email">Other Remarks</label>
                <v-row>
                  <v-col cols="4"
                    ><v-checkbox
                      v-model="incomplete"
                      color="green"
                      label="Incomplete"
                      hide-details
                    ></v-checkbox
                  ></v-col>
                  <v-col cols="4"
                    ><v-checkbox
                      v-model="fda"
                      color="green"
                      label="Failed due to absences"
                      hide-details
                    ></v-checkbox
                  ></v-col>
                  <v-col cols="4"
                    ><v-checkbox
                      v-model="dropped"
                      color="green"
                      label="Dropped"
                      hide-details
                    ></v-checkbox
                  ></v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  block
                  color="primary"
                  :loading="loadingAddGrade"
                  @click="submitGrade()"
                  >Submit</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete student subject Dialog -->
    <v-dialog v-model="deleteStudentGradeDialog" width="auto">
      <v-card
        class="text-body-2"
        color="#263238"
        max-width="400"
        prepend-icon="mdi-delete"
        text="Are you sure you want to delete this student?"
        :title="`Delete Student ${studentno}`"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn
            class="text-none"
            :loading="loadingDeleteGrade"
            text="Delete"
            prepend-icon="mdi-delete"
            color="red"
            variant="tonal"
            @click="deleteStudentGrade()"
          ></v-btn>
          <v-btn
            class="text-none"
            text="Cancel"
            prepend-icon="mdi-close"
            variant="tonal"
            @click="deleteStudentGradeDialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
const router = useRouter();
const route = useRoute();
const toast = useToast();
const loader = ref(true);
const loading = ref(true);
const loading2 = ref(true);
const search = ref(null);
const valid = ref(true);
// Class Details
const classDetails = ref({});
const isEmpty = ref(false);
const addStudentDialog = ref(false);
const studentSubjectList = ref([]);
const updateGradeDialog = ref(false);
const addGradeForm = ref(null);

// Grade
const deleteStudentGradeDialog = ref(false);
const studentSubjID = ref(0);
const studentno = ref("");
const lastname = ref("");
const firstname = ref("");
const middlename = ref("");
const course = ref("");
const section = ref("");
const grade = ref(0);
const numeric_grade = ref(0);
const loadingAddGrade = ref(false);
const loadingDeleteGrade = ref(false);
const remarks = ref("");
const fda = ref(false);
const incomplete = ref(false);
const dropped = ref(false);

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
  { title: "Course", key: "course_code", sortable: false },
  // { title: "Semester", key: "semester", sortable: false },
  // { title: "School Year", key: "school_year", sortable: false },
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
// const gradeRules = ref([ value => {
//   if (value >= 101) return true
//   return 'Firstname must be atleast 3 characters'
// }])

const rules = ref({
  grade: [(v) => !!v || "Grade is required"],
});
const studentList = ref([]);

async function initialize() {
  try {
    let result = await $fetch(`/api/class/${route.params.id}`);

    if (result) {
      classDetails.value = result[0];
      loading.value = false;
      loader.value = false;
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

async function getStudentSubjectList() {
  try {
    let result = await $fetch(`/api/student-subject/list/${route.params.id}`);
    if (result) {
      studentSubjectList.value = result;
    }
  } catch (err) {
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
    remarks: "",
    teacher_id: classDetails.value?.teacher_id,
  };
  console.log("Added Student: ", payload);
  await $fetch("/api/student-subject/createStudentSubject", {
    method: "POST",
    body: payload,
  }).then((response) => {
    if (response.status == "fail") {
      toast.error(response.message);
    } else {
      toast.success("Successfully added.");
      getStudentSubjectList();
    }
  });
}

async function showUpdateGradeDialog(item) {
  console.log("Update Grade: ", item);
  updateGradeDialog.value = true;
  studentSubjID.value = item.document_id;
  studentno.value = item.student_no;
  lastname.value = item.last_name;
  firstname.value = item.first_name;
  middlename.value = item.middle_name;
  grade.value = item.grade;
  numeric_grade.value = item.numeric_grade;
  remarks.value = item.remarks;
  incomplete.value = item.incomplete;
  fda.value = item.fda;
  dropped.value = item.dropped;
}

async function submitGrade() {
  const { valid, errors } = await addGradeForm.value?.validate();
  if (valid) {
    loadingAddGrade.value = true;
    if (grade.value === null || grade.value === "") {
      console.log("Grade is empty");
      grade.value = 0;
    }
    let payload = {
      grade: parseInt(grade.value),
      numeric_grade: numericGrade.value,
      remarks: remarks.value,
      incomplete: incomplete.value,
      fda: fda.value,
      dropped: dropped.value,
    };

    await $fetch(`/api/student-subject/add-grade/${studentSubjID.value}`, {
      method: "PUT",
      body: payload,
    }).then((response) => {
      console.log("Grade submitted: ", response);
      updateGradeDialog.value = false;
      loadingAddGrade.value = false;
      toast.success("Grade successfully updated!");
      getStudentSubjectList();
    });

    //toast.success("Successfully submitted.");
    //console.log("Submitted Grade: ", payload);
  } else {
    console.log(errors[0].errorMessages[0]);
  }
}

async function showDeleteGradeDialog(item) {
  deleteStudentGradeDialog.value = true;
  console.log(item);
  studentno.value = item.student_no;
  studentSubjID.value = item.document_id;
}
async function deleteStudentGrade() {
  try {
    loadingDeleteGrade.value = true;
    let result = await $fetch(
      `/api/student-subject/delete/${studentSubjID.value}`
    );
    if (result) {
      loadingDeleteGrade.value = false;
      deleteStudentGradeDialog.value = false;
      toast.success(`Student ${studentno.value} deleted successfully!`);
      getStudentSubjectList();
      //navigateTo("/courses");
    }
  } catch (err) {
    loadingDeleteGrade.value = false;
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

const numericGrade = computed(() => {
  if (grade.value <= 100 && grade.value >= 98) {
    return Number(1.0).toFixed(2);
  } else if (grade.value <= 97 && grade.value >= 95) {
    return Number(1.25).toFixed(2);
  } else if (grade.value <= 94 && grade.value >= 92) {
    return Number(1.5).toFixed(2);
  } else if (grade.value <= 91 && grade.value >= 89) {
    return Number(1.75).toFixed(2);
  } else if (grade.value <= 88 && grade.value >= 86) {
    return Number(2.0).toFixed(2);
  } else if (grade.value <= 85 && grade.value >= 83) {
    return Number(2.25).toFixed(2);
  } else if (grade.value <= 82 && grade.value >= 80) {
    return Number(2.5).toFixed(2);
  } else if (grade.value <= 79 && grade.value >= 77) {
    return Number(2.75).toFixed(2);
  } else if (grade.value <= 76 && grade.value >= 75) {
    return Number(3.0).toFixed(2);
  } else if (grade.value <= 74 && grade.value > 0) {
    return Number(5.0).toFixed(2);
  } else if (grade.value > 100) {
    return Number(0.0).toFixed(2);
  } else if (grade.value == 0) {
    return Number(0.0).toFixed(2);
  }

  // if (remarks.value == "INCOMPLETE") {
  //   return Number(0.0).toFixed(2);
  // }
});

// const remarks = computed(() => {
//   if (grade.value <= 100 && grade.value >= 75) {
//     return "PASSED";
//   } else if (grade.value <= 74 && grade.value > 0) {
//     return "FAILED";
//   } else if (grade.value > 100) {
//     return "INVALID INPUT";
//   }

//   if (incomplete.value == true) {
//     return "INCOMPLETE";
//   } else if (fda.value == true) {
//     return "FAILED DUE TO ABSENCES";
//   }

//   if (grade.value == 0 && incomplete.value == false && fda.value == false) {
//     return "";
//   }
// });

watch(
  [
    addStudentDialog,
    updateGradeDialog,
    incomplete,
    fda,
    remarks,
    dropped,
    grade,
  ],
  async () => {
    if (addStudentDialog.value == true) {
      //console.log("Add student dialog box opened")
      await getStudentList();
    }

    if (incomplete.value == true) {
      fda.value = false;
      remarks.value = "INCOMPLETE";
      dropped.value = false;
      grade.value = 0;
      //numericGrade.value = "0.00";
    }
    if (fda.value == true) {
      grade.value = 0;
      incomplete.value = false;
      dropped.value = false;
      remarks.value = "FAILED DUE TO ABSENCES";
    }
    if (dropped.value == true) {
      grade.value = 0;
      incomplete.value = false;
      fda.value = false;
      remarks.value = "DROPPED";
    }
    // if (incomplete.value == false && fda.value == false) {
    //   //remarks.value = ""
    // }

    // if (numericGrade.value == "INCOMPLETE") {
    //   grade.value = 0;
    // }
    if (updateGradeDialog.value == true) {
      console.log("Update Grade Dialog box Opened");
      // if (remarks.value == "INCOMPLETE") {
      //   incomplete.value = true;
      // }
    } else if (updateGradeDialog.value == false) {
      console.log("Update Grade Dialog Box Closed!");
      fda.value = false;
      incomplete.value = false;
      dropped.value = false;
    }

    if (grade.value <= 100 && grade.value >= 75) {
      remarks.value = "PASSED";
      incomplete.value = false;
      fda.value = false;
      dropped.value = false;
    } else if (grade.value <= 74 && grade.value > 0) {
      remarks.value = "FAILED";
    } else if (grade.value > 100) {
      remarks.value = "INVALID INPUT";
    } else if (
      grade.value == 0 &&
      incomplete.value == false &&
      fda.value == false &&
      dropped.value == false
    ) {
      remarks.value = "";
    }
  }
);

onMounted(async () => {
  await initialize();
  await getStudentSubjectList();
});
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

:deep() .v-table .v-table__wrapper > table > thead > tr > th {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-bottom: thick solid
    rgba(var(--v-border-color), var(--v-border-opacity));
  font-weight: bold;
  /* background-color: #04aa6d;
  color: white; */
}

:deep() .v-table .v-table__wrapper > table > tbody > tr > td:not(:last-child),
.v-table .v-table__wrapper > table > tbody > tr > th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep() .v-table .v-table__wrapper > table > tbody > tr:nth-child(even) {
  background-color: #f2f2f2;
}

:deep() .v-table .v-table__wrapper > table > tbody > tr:hover {
  background-color: #f2f2f2;
}
</style>
