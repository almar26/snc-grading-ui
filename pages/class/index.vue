<template>
  <div>
    <BaseBreadcrumb
      :title="page.title"
      :icon="page.icon"
      :breadcrumbs="breadcrumbs"
    ></BaseBreadcrumb>
    <v-row>
      <v-col>
        <v-btn class="mb-3" color="primary" @click="showAddCourseDialog()"
          >Add Record</v-btn
        >
        <!-- <v-time-picker use-seconds></v-time-picker> -->
      </v-col>
    </v-row>

    <!-- DIALOG BOX -->
    <v-dialog max-width="500" v-model="dialog" scrollable persistent>
      <v-card>
        <!-- <v-card-title><v-icon>mdi-book</v-icon> Add Course <v-spacer></v-spacer> <v-icon>mdi-close</v-icon></v-card-title> -->
        <v-toolbar>
          <v-icon class="ml-4">mdi-book</v-icon>
          <v-toolbar-title>Add Course</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="mx-5">
          <v-form v-model="valid" ref="createClassForm" lazy-validation>
            <v-row dense>
              <v-col cols="12">
                <!-- <label class="label text-grey-darken-2" for="email">Course</label> -->
                <v-text-field
                  label="Subject Code*"
                  v-model="subjectCode"
                  variant="outlined"
                  :rules="rules.subjectCode"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field
                  label="Subject Description*"
                  v-model="subjectDesc"
                  variant="outlined"
                  :rules="rules.subjectDesc"
                  required
                ></v-text-field>
              </v-col>
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
                  item-title="description"
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
                  :rules="rules.section"
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
                        ></v-time-picker>
                      </v-dialog>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="timeEnd"
                      :active="modal_end"
                      :focused="modal_end"
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
                        ></v-time-picker>
                      </v-dialog>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <small class="text-caption text-medium-emphasis"
              >*indicates required field</small
            >
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
import { useToast } from "vue-toastification";
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
const time = ref(null);
const menu2 = ref(false);
const modal2 = ref(false);
const modal_start = ref(null);
const modal_end = ref(false);

const dialog = ref(false);
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

async function showAddCourseDialog() {
  getCoursesList()
  dialog.value  = true;
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

async function createClass() {
  const { valid, errors } = await createClassForm.value?.validate();
  if (valid) {
    const payload = {
      subject_code: subjectCode.value,
      subject_desc: subjectDesc.value,
      course_code: courseCode.value,
      section: section.value,
      units: units.value,
      semester: semester.value,
      school_year: schoolYear.value,
      days: days.value,
      time_start: timeStart.value,
      time_end: timeEnd.value
    };

    console.log("Class Details: ", payload);
  }
}

onMounted(async () => {
  
})
</script>

<style></style>
