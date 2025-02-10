<template>
  <div>
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row v-if="noData">
      <v-col>
        <div class="d-flex align-center justify-center" style="height: 50vh">
          <v-card width="500" elevation="0" class="text-center d-flex align-center justify-center">
            <v-card-text>
              <v-icon size="70" color="grey-darken-1">mdi-information-outline</v-icon>
              <h2 class="text-grey-darken-1">No Data Available</h2>
              <v-btn v-if="classSettings.enable_create_class == true" class="mb-3 mt-10 text-capitalize" variant="flat" prepend-icon="mdi-plus" color="primary"
                @click="showAddCourseDialog()">Create Class</v-btn>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="12">
        <v-skeleton-loader v-if="loader" class="mx-auto" elevation="0" color="transparent" :loading="loader"
          type="article, list-item-two-line">
        </v-skeleton-loader>
        <v-card elevation="0" color="transparent" v-else>
          <v-toolbar elevation="0" dense color="transparent" v-if="classSettings.enable_create_class == true">
            <v-btn class="mb-3 text-capitalize" variant="flat" prepend-icon="mdi-plus" color="primary"
              @click="showAddCourseDialog()">Create Class</v-btn>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-row no-gutters>
            <v-col cols="12" v-for="item in classList" :key="item.id">
              <v-card elevation="0" class="c-card mb-2" :to="`/class/${item.documentId}`" :loading="false">
                <v-row no-gutters>
                  <v-col cols="12" md="3" class="pl-5">
                    <div class="c-name mt-3">{{ item.subject_code }}</div>
                    <div class="c-brgy mb-3">
                      {{ item.subject_description }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="2">

                  </v-col>
                  <v-col cols="12" md="6">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th class="text-left title-table">
                            Course & Section
                          </th>
                          <th class="text-left title-table">Semester</th>
                          <th class="text-left title-table">School Year</th>
                          <!-- <th class="text-left title-table">Days</th>
                          <th class="text-left title-table">Time</th> -->
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="value-table">
                            {{ item.course_code }}-{{ item.section }}
                          </td>
                          <td class="value-table">{{ item.semester }}</td>
                          <td class="value-table">{{ item.school_year }}</td>
                          <!-- <td class="value-table">{{ item.days }}</td>
                          <td class="value-table">
                            {{ item.time_start }} - {{ item.time_end }}
                          </td> -->
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                  <v-col cols="12" md="1">
                    <!-- <div>
                      <v-card height="80" color="green" class="elevation-0">
                        <v-icon size="50">mdi-check-circle-outline</v-icon>
                      </v-card>
                    </div> -->
                  
                    <!-- <v-sheet v-if="item.finalize == true" height="80" class="d-flex align-center justify-center" color="green">
                      <v-icon  size="50" >mdi-check-circle-outline</v-icon>
                    </v-sheet>
                    <v-sheet v-else  height="80" class="d-flex align-center justify-center" color="warning">
                      <v-icon size="50" >mdi-information-outline</v-icon>
                    </v-sheet> -->
                    <v-sheet height="80" class="d-flex align-center justify-center">
                      <v-icon v-if="item.finalize == true" color="success"  size="60" >mdi-check-circle-outline</v-icon>
                      <v-icon v-else color="#E0E0E0" size="60" >mdi-check-circle-outline</v-icon>
                    </v-sheet>
                  </v-col>
                  <!-- <v-col cols="12" md="2" class="text-right">
                      <v-btn class="btn-check" color="primary" size="small" icon="mdi-open-in-new" elevation="0"
                        :to="`/class/${item.documentId}`" v-show="true"></v-btn>
                      <v-btn class="btn-check" color="red" size="small" icon="mdi-delete" elevation="0"
                        v-show="true"></v-btn>
                    </v-col> -->

                  <!-- <v-col cols="12" md="1" class="text-right">
                      <v-btn class="btn-check" color="primary" elevation="0" :to="`/class/${item.documentId}`"
                        v-show="true">View</v-btn>
                    </v-col> -->
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- <v-fab color="primary" icon="mdi-plus" location="bottom end" class="mb-4"  size="64" @click="showAddCourseDialog()" absolute app appear></v-fab> -->
      </v-col>
    </v-row>

    <!-- DIALOG BOX -->
    <v-dialog max-width="500" v-model="createClassDialog" scrollable persistent>
      <v-card>
        <!-- <v-card-title><v-icon>mdi-book</v-icon> Add Course <v-spacer></v-spacer> <v-icon>mdi-close</v-icon></v-card-title> -->
        <v-toolbar color="primary" density="compact">
          <v-icon class="ml-4">mdi-book</v-icon>
          <v-toolbar-title>Create Class</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="createClassDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="mx-5">
          <v-form v-model="valid" ref="createClassForm" lazy-validation>
            <v-row dense>
              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <!-- <v-text-field
                  label="Course"
                  v-model="courseCode"
                  variant="outlined"
                  :rules="rules.courseCode"
                  required
                ></v-text-field> -->
                <v-select color="primary" :items="courses" item-title="code" item-value="code" label="Course*"
                  v-model="courseCode" :rules="rules.courseCode" variant="outlined" return-object required></v-select>
              </v-col>
              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field label="Section" v-model="section" variant="outlined"
                  @input="section = section.toUpperCase()" :rules="rules.section" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- <label class="label text-grey-darken-2" for="email">Course</label> -->
                <!-- <v-text-field
                  label="Subject Code*"
                  v-model="subjectCode"
                  variant="outlined"
                  :rules="rules.subjectCode"
                  required
                ></v-text-field> -->
                <v-select color="primary" :items="subjectList" item-title="code" item-value="code" label="Subject Code*"
                  v-model="subjectCode" :rules="rules.subjectCode" variant="outlined" return-object required></v-select>
              </v-col>

              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field label="Subject Description*" v-model="subjectDesc"
                  @input="subjectDesc = subjectDesc.toUpperCase()" variant="outlined" :rules="rules.subjectDesc"
                  readonly required></v-text-field>
              </v-col>

              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field label="Units" v-model="units" variant="outlined" :rules="rules.units" type="number"
                  readonly required></v-text-field>
              </v-col>
              <!-- <v-col cols="12">
                <v-select
                  color="primary"
                  v-model="semester"
                  :items="['1st Semester', '2nd Semester', 'Summer']"
                  variant="outlined"
                  :rules="rules.semester"
                  label="Semester*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="School Year"
                  v-model="schoolYear"
                  variant="outlined"
                  :rules="rules.schoolYear"
                  required
                ></v-text-field>
              </v-col> -->
              <!-- <v-col cols="12">
                <v-combobox
                  v-model="days"
                  :items="itemDays"
                  label="Days"
                  variant="outlined"
                  :rules="rules.days"
                >
                </v-combobox>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="timeStart"
                      :active="modal_start"
                      :focused="modal_start"
                      :rules="rules.timeStart"
                      hide-details="false"
                      variant="outlined"
                      label="Time Start"
                      prepend-inner-icon="mdi-clock-time-four-outline"
                      readonly
                    >
                      <v-dialog
                        v-model="modal_start"
                        activator="parent"
                        width="auto"
                      >
                        <v-time-picker
                          v-if="modal_start"
                          v-model="timeStart"
                          format="24r"
                          use-seconds
                        ></v-time-picker>
                        <v-btn
                          color="primary"
                          @click="modal_start = !modal_start"
                          >Ok</v-btn
                        >
                      </v-dialog>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="timeEnd"
                      :active="modal_end"
                      :focused="modal_end"
                      :rules="rules.timeEnd"
                      hide-details="false"
                      variant="outlined"
                      label="Time End"
                      prepend-inner-icon="mdi-clock-time-four-outline"
                      readonly
                    >
                      <v-dialog
                        v-model="modal_end"
                        activator="parent"
                        width="auto"
                      >
                        <v-time-picker
                          v-if="modal_end"
                          v-model="timeEnd"
                          format="24r"
                          use-seconds
                        ></v-time-picker>
                        <v-btn color="primary" @click="modal_end = !modal_end"
                          >Ok</v-btn
                        >
                      </v-dialog>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col> -->
            </v-row>

            <!-- <small class="text-caption text-medium-emphasis"
              >*indicates required field</small
            > -->
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="mx-5 my-2">
          <v-btn block color="green" text="Save" variant="flat" :loading="loadingCreateClass"
            @click="createClass()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
import { useToast } from "vue-toastification";
const { userInfo } = storeToRefs(useMyAuthStore());
const userData = ref(userInfo?.value.user);
useHead({
  title: "Classes",
});
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
    title: "Classes",
    disabled: true,
  },
]);
const toast = useToast();
const loader = ref(true);
const noData = ref(false);
const modal_start = ref(null);
const modal_end = ref(false);
const loadingCreateClass = ref(false);
const createClassDialog = ref(false);
const valid = ref(true);
const subjectCode = ref("");
const subjectDesc = ref("");
const courseCode = ref("");
const section = ref("");
const units = ref(0);
const semester = ref("");
const schoolYear = ref("");
const days = ref("");
const timeStart = ref(null);
const timeEnd = ref(null);
const itemDays = ref(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
const courses = ref([]);
const subjectList = ref([]);
const emptySubject = ref(false);
const createClassForm = ref(null);
const classList = ref([]);
const classSettings = ref({});
const rules = ref({
  subjectCode: [(v) => !!v || "Subject code is required"],
  subjectDesc: [(v) => !!v || "Subject description is required"],
  courseCode: [(v) => !!v || "Course code is required"],
  section: [(v) => !!v || "Section is required"],
  units: [(v) => !!v || "Units is required"],
  semester: [(v) => !!v || "Semester is required"],
  schoolYear: [(v) => !!v || "School Year is required"],
  days: [(v) => !!v || "Days is required"],
  timeStart: [(v) => !!v || "Time Start is required"],
  timeEnd: [(v) => !!v || "Time End is required"],
});
async function initialize() {
  try {
    let result = await $fetch(
      `/api/class/getClassList?teacher_id=${userData.value.teacher_id}&sy=${schoolYear.value}&semester=${semester.value}`
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

// Get Class Settings
async function getClassSettings() {
  try {
    let result = await $fetch(`/api/class-settings/getClassSettings`);
    if (result) {
      //console.log("Class Settings: ", result.data[0]);
      classSettings.value = result.data[0];
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}


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


async function showAddCourseDialog() {
  getCoursesList();
  createClassDialog.value = true;
}

async function getCoursesList() {
  try {
    let result = await $fetch("/api/course/getCourseList");
    if (result) {
      courses.value = result;
    }
  } catch (err) {
    console.error("Failed ot fetch data: ", err);
    throw err;
  }
}

async function getSubjectsByCourse(coursecode) {
  try {
    let result = await $fetch(`/api/subject/getSubjectsByCourse/${coursecode}`);
    if (result) {
      subjectList.value = result;
      if (result.length == 0) {
        //console.log("Course doesn't have subjects");
        //emptySubject.value = true;
        subjectCode.value = "";
        subjectDesc.value = "";
        units.value = 0;
      }
      let selectedCourse = courseCode.value?.code;
      let subject = subjectCode.value?.course_code;
      // console.log("COURSE SUBJECT: ", result[0].course_code)
      if (selectedCourse != subject) {
        subjectCode.value = "";
        subjectDesc.value = "";
        units.value = 0;
      }
    }
  } catch (err) {
    console.error("Failed ot fetch data: ", err);
    throw err;
  }
}

async function createClass() {
  const { valid, errors } = await createClassForm.value?.validate();
  loadingCreateClass.value = true;
  if (valid) {
    const payload = {
      teacher_id: userData.value.teacher_id,
      subject_code: subjectCode.value?.code,
      subject_desc: subjectDesc.value,
      course_code: courseCode.value?.code,
      section: section.value,
      units: units.value,
      semester: semester.value,
      school_year: schoolYear.value,
      //days: days.value,
      //time_start: timeStart.value,
      //time_end: timeEnd.value,
      faculty_no: userData.value.username,
      teacher_name: userData.value.first_name + " " + userData.value.last_name,
    };

    await $fetch(`/api/class/createClass`, {
      method: "POST",
      body: payload,
    }).then((response) => {
      if (response.status == "fail") {
        //console.log(response.message);
        loadingCreateClass.value = false;
        toast.error(response.message);
      } else {
        createClassDialog.value = false;
        loadingCreateClass.value = false;
        createClassForm.value?.reset();
        toast.success("Successfully created!");
        initialize();
      }
    });
    //console.log("Class Details: ", payload);
  } else {
    console.log(errors[0].errorMessages[0]);
    loadingCreateClass.value = false;
  }
}

async function classDetails(item) {
  console.log("Hello Class", item);
}

onMounted(async () => {
  await getActiveSchoolyear();
  await getClassSettings();
  await initialize();
 
});

watch([createClassDialog, courseCode, subjectCode], async () => {
  if (createClassDialog.value === false) {
    //console.log("Create Class dialog box closed");
    createClassForm.value?.reset();
  }
  if (courseCode.value) {
    //console.log("Selected Course: ", courseCode.value?.code);
    getSubjectsByCourse(courseCode.value?.code);
    if (subjectCode.value) {
      //console.log("Subject: ", subjectCode.value);
      subjectDesc.value = subjectCode.value?.title;
      units.value = subjectCode.value?.units;
    }
  }
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
</style>
