<template>
  <div>
    <BaseBreadcrumb
      :title="page.title"
      :icon="page.icon"
      :breadcrumbs="breadcrumbs"
    ></BaseBreadcrumb>
    <v-row>
      <v-col>
        <v-btn
          class="mb-3 text-capitalize"
          prepend-icon="mdi-plus"
          color="primary"
          @click="showAddCourseDialog()"
          >Create Class</v-btn
        >
        <!-- <v-time-picker use-seconds></v-time-picker> -->
        <v-card> </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG BOX -->
    <v-dialog max-width="500" v-model="createClassDialog" scrollable persistent>
      <v-card>
        <!-- <v-card-title><v-icon>mdi-book</v-icon> Add Course <v-spacer></v-spacer> <v-icon>mdi-close</v-icon></v-card-title> -->
        <v-toolbar>
          <v-icon class="ml-4">mdi-book</v-icon>
          <v-toolbar-title>Add Class</v-toolbar-title>
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
                <v-select
                  color="primary"
                  :items="courses"
                  item-title="code"
                  item-value="code"
                  label="Course*"
                  v-model="courseCode"
                  :rules="rules.courseCode"
                  variant="outlined"
                  return-object
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field
                  label="Section"
                  v-model="section"
                  variant="outlined"
                  @input="section = section.toUpperCase()"
                  :rules="rules.section"
                  required
                ></v-text-field>
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
                <v-select
                  color="primary"
                  :items="subjectList"
                  item-title="code"
                  item-value="code"
                  label="Subject Code*"
                  v-model="subjectCode"
                  :rules="rules.subjectCode"
                  variant="outlined"
                  return-object
                  required
                ></v-select>
              </v-col>

              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field
                  label="Subject Description*"
                  v-model="subjectDesc"
                  @input="subjectDesc = subjectDesc.toUpperCase()"
                  variant="outlined"
                  :rules="rules.subjectDesc"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field
                  label="Units"
                  v-model="units"
                  variant="outlined"
                  :rules="rules.units"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
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
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field
                  label="School Year"
                  v-model="schoolYear"
                  variant="outlined"
                  :rules="rules.schoolYear"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <!-- <v-text-field
                  label="Days"
                  v-model="days"
                  variant="outlined"
                  :rules="rules.days"
                  required
                ></v-text-field> -->
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
              </v-col>
            </v-row>

            <!-- <small class="text-caption text-medium-emphasis"
              >*indicates required field</small
            > -->
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="mx-5 my-2">
          <v-btn
            block
            color="green"
            text="Save"
            variant="flat"
            @click="createClass()"
          ></v-btn>
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
  title: "Class",
});
const page = ref({
  title: "Class",
});
const breadcrumbs = ref([
  {
    title: "Dashboard",
    disabled: false,
    to: "/",
  },
  {
    title: "class",
    disabled: true,
  },
]);
const toast = useToast();
const time = ref(null);
const menu2 = ref(false);
const modal2 = ref(false);
const modal_start = ref(null);
const modal_end = ref(false);

const dialog = ref(false);
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
      `/api/class/getClassList?teacher_id=${userData.value.teacher_id}&sy=2024-2025&semester=1st Semester`
    );
    if (result) {
      console.log("List: ", result);
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
        console.log("Course doesn't have subjects");
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
      days: days.value,
      time_start: timeStart.value,
      time_end: timeEnd.value,
      faculty_no: userData.value.username,
      teacher_name: userData.value.first_name + " " + userData.value.last_name,
    };

    await $fetch(`/api/class/createClass`, {
      method: "POST",
      body: payload,
    }).then((response) => {
      if (response.status == "fail") {
        console.log(response.message);
        toast.error(response.message);
      } else {
        createClassDialog.value = false;
        createClassForm.value?.reset();
        toast.success("Successfully created!");
        initialize();
      }
    });
    console.log("Class Details: ", payload);
  } else {
    console.log(errors[0].errorMessages[0]);
  }
}

onMounted(async () => {
  initialize();
});

watch([courseCode, subjectCode], async () => {
  if (courseCode.value) {
    //console.log("Selected Course: ", courseCode.value?.code);
    getSubjectsByCourse(courseCode.value?.code);
    if (subjectCode.value) {
      console.log("Subject: ", subjectCode.value);
      subjectDesc.value = subjectCode.value?.title;
      units.value = subjectCode.value?.units;
    }
  }
});
</script>

<style></style>
