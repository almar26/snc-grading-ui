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
            <v-spacer></v-spacer>
            <PrintGradingSheet :studentSubjectList="studentSubjectList" :classDetails="classDetails" :userData="userData"/>
            <div v-if="finalizeClass == null || finalizeClass == false">
              <v-btn color="warning" icon size="small" variant="text" @click="showUpdateClassDialog()"><v-icon
                  size="large">mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">Edit</v-tooltip></v-btn>
              <!-- <v-btn color="red" icon size="small" variant="text" @click="deleteCourseDialog = true"><v-icon
                size="large">mdi-delete</v-icon><v-tooltip activator="parent" location="top">Delete</v-tooltip></v-btn> -->
            </div>
          </v-toolbar>
          <v-divider></v-divider>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-subtitle class="title">Course & Section</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ classDetails.course_code }}-{{
                classDetails.section
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Subject</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ classDetails.subject_code }} -
                {{ classDetails.subject_description }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Semester</v-list-item-subtitle>
              <v-list-item-title class="desc">{{
                classDetails.semester
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">School Year</v-list-item-subtitle>
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
            <!-- <v-list-item>
              <v-list-item-subtitle class="title">Days</v-list-item-subtitle>
              <v-list-item-title class="desc">{{
                finalizeClass
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle class="title">Time</v-list-item-subtitle>
              <v-list-item-title class="desc">{{ classDetails.time_start }} -
                {{ classDetails.time_end }}</v-list-item-title>
            </v-list-item> -->
            
          </v-list>

          <!-- <v-divider></v-divider> -->

          <v-card-actions v-if="finalizeClass == null || finalizeClass == false">
            
            <v-btn prepend-icon="mdi-check-circle" @click="finalizedClassDialog = true" color="green" variant="flat"
              block>Finalize</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card variant="flat">
          <v-toolbar color="transparent" class="px-3" density="comfortable"
            v-if="finalizeClass == null || finalizeClass == false">
            
            
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="blue" class="text-capitalize px-4 mr-2" @click="showImportStudentDialog()">
              <v-icon start>mdi-import</v-icon>Import Student</v-btn>
            <v-btn variant="flat" color="primary" class="text-capitalize px-4" @click="addStudentDialog = true">
              <v-icon start>mdi-plus</v-icon>Add Student</v-btn>
          </v-toolbar>
          <v-divider></v-divider>

          <v-data-table density="compact" :items="studentSubjectList" :headers="headers" :loading="loading">
            <template v-slot:[`item.actions`]="{ item }" v-if="finalizeClass == null || finalizeClass == false">
              <v-tooltip text="Input Grade" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn size="medium" variant="text" v-bind="props" @click="showUpdateGradeDialog(item)"
                    color="primary">
                    <v-icon size="30">mdi-text-box-check</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Delete" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn size="medium" v-bind="props" @click="showDeleteGradeDialog(item)" variant="text" color="red">
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
    <!-- Update Class Dialog -->
    <v-dialog max-width="500" v-model="updateClassDialog" scrollable persistent>
      <v-card>
        <!-- <v-card-title><v-icon>mdi-book</v-icon> Add Course <v-spacer></v-spacer> <v-icon>mdi-close</v-icon></v-card-title> -->
        <v-toolbar color="primary" density="compact">
          <v-icon class="ml-4">mdi-book</v-icon>
          <v-toolbar-title>Update Class Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="updateClassDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="mx-5">
          <v-form v-model="valid" ref="updateClassForm" lazy-validation>
            <v-row dense>
              <v-col cols="12">
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
                <v-select color="primary" :items="subjectList" item-title="code" item-value="code" label="Subject Code*"
                  v-model="subjectCode" :rules="rules.subjectCode" variant="outlined" return-object required></v-select>
              </v-col>

              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field label="Subject Description*" v-model="subjectDesc"
                  @input="subjectDesc = subjectDesc.toUpperCase()" readonly variant="outlined"
                  :rules="rules.subjectDesc" required></v-text-field>
              </v-col>

              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field label="Units" v-model="units" readonly variant="outlined" :rules="rules.units"
                  type="number" required></v-text-field>
              </v-col>
              <!-- <v-col cols="12">
                <v-select color="primary" v-model="semester" :items="['1st Semester', '2nd Semester', 'Summer']"
                  variant="outlined" :rules="rules.semester" label="Semester*" required></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field label="School Year" v-model="schoolYear" variant="outlined" :rules="rules.schoolYear"
                  required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-combobox v-model="days" :items="itemDays" label="Days" variant="outlined" :rules="rules.days">
                </v-combobox>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="timeStart" :active="modal_start" :focused="modal_start"
                      :rules="rules.timeStart" hide-details="false" variant="outlined" label="Time Start"
                      prepend-inner-icon="mdi-clock-time-four-outline" readonly>
                      <v-dialog v-model="modal_start" activator="parent" width="auto">
                        <v-time-picker v-if="modal_start" v-model="timeStart" format="24r" use-seconds></v-time-picker>
                        <v-btn color="primary" @click="modal_start = !modal_start">Ok</v-btn>
                      </v-dialog>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="timeEnd" :active="modal_end" :focused="modal_end" :rules="rules.timeEnd"
                      hide-details="false" variant="outlined" label="Time End"
                      prepend-inner-icon="mdi-clock-time-four-outline" readonly>
                      <v-dialog v-model="modal_end" activator="parent" width="auto">
                        <v-time-picker v-if="modal_end" v-model="timeEnd" format="24r" use-seconds></v-time-picker>
                        <v-btn color="primary" @click="modal_end = !modal_end">Ok</v-btn>
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
          <v-btn block color="green" text="Save" variant="flat" :loading="loadingUpdateClass"
            @click="updateClass()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          <v-text-field v-model="search" density="compact" label="Search" clearable prepend-inner-icon="mdi-magnify"
            variant="outlined" flat hide-details single-line></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <v-data-table density="compact" :search="search" :items="studentList" :headers="studentHeaders"
            :loading="loading2">
            <template v-slot:loading2>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>
            <!-- <template v-slot:[`item.course_code`]="{ item }">
              {{ item.course_code }}-{{ item.section }}
            </template> -->
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

    <!-- Import Students from existing class -->
    <v-dialog max-width="1000" v-model="importStudentDialog" scrollable persistent>
      <v-card elevation="0">
        <v-toolbar color="primary" density="compact">
          <v-icon class="ml-4">mdi-account-group</v-icon>
          <v-toolbar-title> Import Students</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="importStudentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <div class="d-flex align-center justify-center" style="height: 30vh" v-if="loaderImport">
            <v-card class="elevation-0 text-center py-16" color="transparent">
              <v-progress-circular :size="70" :width="7" indeterminate></v-progress-circular>
              <div class="service-notif mt-5">Loading....</div>
            </v-card>
          </div>
          <!-- <v-data-iterator :items="classStudentList" item-value="id" v-else>
            <template v-slot:default="{ items, isExpanded, toggleExpand }">
              <v-row>
                <v-col v-for="item in items" :key="item.raw.id" cols="12">
                  <v-card variant="flat">
                    <v-toolbar color="transparent" density="compact">
                      <v-toolbar-title>
                        <h5>{{ item.raw.subject_code }} - {{ item.raw.subject_description }}</h5>

                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn variant="flat" color="primary" class="text-capitalize"
                        @click="importStudents(item.raw.student_list)"><v-icon start>mdi-import</v-icon> Import</v-btn>
                    </v-toolbar>
                    <div class="pl-5">
                      <h4>{{ item.raw.course_code }}-{{ item.raw.section }}</h4>
                    </div>
                   
                    <div class="px-4 pt-7">
                      <v-switch color="primary" :label="`${isExpanded(item) ? 'Hide' : 'Show'} students`"
                        :model-value="isExpanded(item)" density="compact" inset
                        @click="() => toggleExpand(item)"></v-switch>
                    </div>

                    <v-expand-transition>
                      <div v-if="isExpanded(item)">
                        <v-divider></v-divider>
                        <v-data-table density="compact" :items="item.raw.student_list" :headers="studentClassHeaders"
                          :loading="loading2">
                          <template v-slot:loading2>
                            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                          </template>
                        </v-data-table>
                      </div>
                    </v-expand-transition>
                  </v-card>
                  <v-divider></v-divider>
                </v-col>

              </v-row>
            </template>
          </v-data-iterator> -->

          <v-row dense>
            <v-col cols="12" md="6" v-for="(item, $index) in classStudentList" :key="$index">
              <v-card class="mb-3 card-outlined" elevation="0">
                <v-card-title>
                 <v-icon size="25">mdi-book</v-icon> {{ item.subject_code }} ({{ item.course_code }}-{{ item.section }})
                </v-card-title>
                <v-card-subtitle>
                  {{ item.subject_description }}
                  <!-- {{ item.course_code }}-{{ item.section }} -->
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="item.show = !item.show"></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" prepend-icon="mdi-import" text="Import" variant="outlined"
                    @click="importStudents(item.student_list)"></v-btn>

                </v-card-actions>
                <v-expand-transition>
                  <div v-show="item.show">
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-data-table density="compact" :items="item.student_list" :headers="studentClassHeaders"
                        :loading="loading2">
                        <template v-slot:loading2>
                          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
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
            <v-col cols="3" class="text-uppercase font-weight-bold text-subtitle-2 text-green">Student No.</v-col>
            <v-col cols="1" class="font-weight-bold">:</v-col>
            <v-col cols="8" class="font-weight-bold">{{ studentno }}</v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="3" class="text-uppercase font-weight-bold text-subtitle-2 text-green">Name</v-col>
            <v-col cols="1" class="font-weight-bold">:</v-col>
            <v-col cols="8" class="font-weight-bold text-subtitle-3">{{ lastname }}, {{ firstname }} {{ middlename
              }}</v-col>
          </v-row>
        </div>
        <v-divider></v-divider>
        <v-card-text>
          <v-form v-model="valid" fast-fail ref="addGradeForm" lazy-validation>
            <v-row dense>
              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field label="Grade" v-model="grade" variant="outlined" type="number" required></v-text-field>
              </v-col>

              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field label="Numeric Grade" v-model="numericGrade" variant="outlined" required
                  readonly></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- <label class="label mb-4" for="email">Student No</label> -->
                <v-text-field label="Remarks" v-model="remarks" variant="outlined"
                  @input="remarks = remarks.toUpperCase()" required readonly></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label class="label mb-4" for="email">Other Remarks</label>
                <v-row dense>
                  <v-col cols="12" md="4"><v-checkbox v-model="incomplete" color="green" label="Incomplete"
                      hide-details></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="4"><v-checkbox v-model="fda" color="green" label="Failed due to absences"
                      hide-details></v-checkbox></v-col>
                  <v-col cols="12" md="4"><v-checkbox v-model="dropped" color="green" label="Dropped"
                      hide-details></v-checkbox></v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn block color="primary" :loading="loadingAddGrade" @click="submitGrade()">Submit</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete student subject Dialog -->
    <v-dialog v-model="deleteStudentGradeDialog" width="auto">
      <v-card class="text-body-2" color="#263238" max-width="400" prepend-icon="mdi-delete"
        text="Are you sure you want to delete this student?" :title="`Delete Student ${studentno}`">
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn class="text-none" :loading="loadingDeleteGrade" text="Delete" prepend-icon="mdi-delete" color="red"
            variant="tonal" @click="deleteStudentGrade()"></v-btn>
          <v-btn class="text-none" text="Cancel" prepend-icon="mdi-close" variant="tonal"
            @click="deleteStudentGradeDialog = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>

    <!-- Finalized Class Dialog -->
    <v-dialog v-model="finalizedClassDialog" width="auto">
      <v-card class="text-body-2" color="#607D8B" max-width="400" prepend-icon="mdi-check-circle"
        text="Are you sure you want to finalize this class?" :title="`Finalize Class`">
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn class="text-none" rounded :loading="loadingDeleteGrade" text="Finalize" prepend-icon="mdi-check"
            variant="tonal" @click="finalizedClass()"></v-btn>
          <v-btn class="text-none" rounded text="Cancel" prepend-icon="mdi-close" color="red" variant="tonal"
            @click="finalizedClassDialog = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>


    <!-- Add Student Loader Dialog box -->
    <v-dialog v-model="addStudentLoader" max-width="320" persistent>
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

    <!-- Add Finalize Class Loader Dialog box -->
    <v-dialog v-model="finalizeLoader" max-width="320" persistent>
      <v-list class="py-2" color="primary" elevation="12" rounded="lg">
        <v-list-item prepend-icon="mdi-check-circle" title="Finalizing class...">
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

    <!-- Import Students Loader Dialog box -->
    <v-dialog v-model="importStudentLoader" max-width="320" persistent>
      <v-list class="py-2" color="primary" elevation="12" rounded="lg">
        <v-list-item prepend-icon="mdi-import" title="Importing students...">
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
const loader = ref(true);
const loaderImport = ref(true)
const loading = ref(true);
const loading2 = ref(true);
const addStudentLoader = ref(false)
const importStudentLoader = ref(false);
const search = ref(null);
const valid = ref(true);
// Class Details
const loadingUpdateClass = ref(false);
const updateClassDialog = ref(false);
const finalizedClassDialog = ref(false);
const finalizeLoader = ref(false);
const modal_start = ref(null);
const modal_end = ref(false);
const updateClassForm = ref(null);
const classDetails = ref({});
const isEmpty = ref(false);
const addStudentDialog = ref(false);
const importStudentDialog = ref(false);
const studentSubjectList = ref([]);
const updateGradeDialog = ref(false);
const addGradeForm = ref(null);
const subjectCode = ref("");
const subjectDesc = ref("");
const courseCode = ref("");
const finalizeClass = ref(null);
// const section = ref("");
const units = ref(0);
const semester = ref("");
const activeSemester = ref("");
const activeSY = ref("")
const schoolYear = ref("");
const days = ref("");
const timeStart = ref(null);
const timeEnd = ref(null);
const itemDays = ref(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
const courses = ref([]);
const subjectList = ref([]);
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
const classStudentList = ref([])
const isExpanded = ref(false);
const show = ref(false);

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

const studentClassHeaders = ref([
  { title: "Student No", sortable: false, key: "student_no" },
  { title: "Lastname", sortable: false, key: "last_name" },
  { title: "Firstname", sortable: false, key: "first_name" },
  { title: "Middlename", sortable: false, key: "middle_name" },
  { title: "Course", sortable: false, key: "course_code" },

])
// const gradeRules = ref([ value => {
//   if (value >= 101) return true
//   return 'Firstname must be atleast 3 characters'
// }])

// const rules = ref({
//   grade: [(v) => !!v || "Grade is required"],
// });
const studentList = ref([]);

async function initialize() {
  try {
    let result = await $fetch(`/api/class/${route.params.id}`);

    if (result) {
      if (result.length == 0) {
        isEmpty.value = true;
        //loading.value = false;
      }
      console.log("User Data: ", userData.value)
      classDetails.value = result[0];
      subjectCode.value = result[0].subject_code;
      subjectDesc.value = result[0].subject_description;
      courseCode.value = result[0].course_code;
      section.value = result[0].section;
      units.value = result[0].units;
      semester.value = result[0].semester;
      schoolYear.value = result[0].school_year;
      days.value = result[0].days;
      timeStart.value = result[0].time_start;
      timeEnd.value = result[0].time_end;
      finalizeClass.value = result[0].finalize;
      //loading.value = false;
      loader.value = false;

    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
    loading.value = false;
    throw err;
  }
}

async function getActiveSchoolyear() {
  try {
    let result = await $fetch("/api/school-year/getActiveSchoolYear");

    if (result) {
      activeSemester.value = result[0].semester
      activeSY.value = result[0].school_year;
      //console.log("Active School Year: ", result[0])
    }
  } catch (err) {
    console.error("Failed to fetch data: ", err);
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

async function showUpdateClassDialog() {
  getCoursesList();
  updateClassDialog.value = true;
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

async function updateClass() {
  const { valid, errors } = await updateClassForm.value?.validate();
  loadingUpdateClass.value = true;
  if (valid) {
    let course_code_update;
    let subject_code_update;
    if (courseCode.value?.code === undefined) {
      course_code_update = courseCode.value
      subject_code_update = subjectCode.value
      //console.log("course code payload undefined", course_code_update);
    } else {
      course_code_update = courseCode.value?.code
      subject_code_update = subjectCode.value?.code
      //console.log("course code updated payload undefined", course_code_update);
    }
    const payload = {
      teacher_id: userData.value.teacher_id,
      subject_code: subject_code_update,
      subject_desc: subjectDesc.value,
      course_code: course_code_update,
      section: section.value,
      units: units.value,
      semester: activeSemester.value,
      school_year: activeSY.value,
      days: days.value,
      time_start: timeStart.value,
      time_end: timeEnd.value,
    };
    //console.log("Update Class: ", payload);

    await $fetch(`/api/class/update/${route.params.id}`, {
      method: "PUT",
      body: payload,
    }).then((response) => {
      if (response.status == "fail") {
        //console.log(response.message);
        loadingUpdateClass.value = false;
        toast.error(response.message);
      } else {
        updateClassDialog.value = false;
        loadingUpdateClass.value = false;
        updateClassForm.value?.reset();
        toast.success("Successfully updated!");
        initialize();
      }
    });
    //console.log("Updated Class Details: ", payload);
  } else {
    console.log(errors[0].errorMessages[0]);
    loadingUpdateClass.value = false;
  }
}

async function getStudentSubjectList() {
  try {
    let result = await $fetch(`/api/student-subject/list/${route.params.id}`);
    if (result) {
      studentSubjectList.value = result;
      loading.value = false;
      addStudentLoader.value = false;
    }
  } catch (err) {
    loading.value = false;
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}
async function addStudent(item) {
  //console.log("Added Student: ", item)
  addStudentLoader.value = true;
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
    numeric_grade: "0.00",
    remarks: "",
    teacher_id: classDetails.value?.teacher_id,
  };
  //console.log("Added Student: ", payload);
  await $fetch("/api/student-subject/createStudentSubject", {
    method: "POST",
    body: payload,
  }).then((response) => {
    if (response.status == "fail") {
      toast.error(response.message);
      addStudentLoader.value = false;
    } else {
      toast.success("Successfully added.");
      getStudentSubjectList();
      //addStudentLoader.value = false;
    }
  });
}

async function showUpdateGradeDialog(item) {
  //console.log("Update Grade: ", item);
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
      //console.log("Grade is empty");
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
      //console.log("Grade submitted: ", response);
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
  //console.log(item);
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

async function finalizedClass() {
  finalizeLoader.value = true;
  let payload = {
    finalized: true
  }
  await $fetch(`/api/class/finalized/${route.params.id}`, {
    method: "PUT",
    body: payload
  }).then(response => {
    finalizeLoader.value = false;
    finalizedClassDialog.value = false;
    toast.success("Class Successfully Finalized!")
    initialize();
  })
    .catch(err => {
      console.log(err);
      finalizeLoader.value = false;
      finalizedClassDialog.value = false;
    })
}

// Show import student dialog box
async function showImportStudentDialog() {
  importStudentDialog.value = true
  getClassStudents()
}


async function getClassStudents(ctx) {
  try {
    let result = await $fetch(`/api/class/getClassStudents?teacher_id=${userData.value.teacher_id}&class_id=${route.params.id}&sy=${activeSY.value}&semester=${activeSemester.value}`);

    if (result) {
      //console.log("Classes List: ", result);
      loaderImport.value = false;
      classStudentList.value = result;
      loading2.value = false;
    }
  } catch (err) {
    loaderImport.value = false
    console.error("Failed to fetch data: ", err);
    throw err;
  }
}

async function importStudents(items) {
  console.log("List of Imported Students", items);
  importStudentLoader.value = true;
  if (items.length == 0) {
    //console.log("No students imported!");
    toast.error("No available students to be imported!");
    importStudentLoader.value = false;
  } else {
    let arrObj = items;
    for (const element of arrObj) {
      element.class_id = route.params.id;
      element.section = classDetails.value?.section;
      element.subject_code = classDetails.value?.subject_code;
      element.unit = classDetails.value?.units;
      element.semester = classDetails.value?.semester;
      element.school_year = classDetails.value?.school_year;
      element.grade = 0;
      element.numeric_grade = "0.00";
      element.remarks = "";
      element.teacher_id = classDetails.value?.teacher_id;
    }
    //console.log("List of Imported Students with new elements", arrObj);

    let payload = {
      student_list: arrObj
    }
    await $fetch(`/api/student-subject/importMultipleStudents`, {
      method: "POST",
      body: payload
    })
      .then(response => {
        //console.log(response);
        toast.success("Successfully imported!");
        getStudentSubjectList();
        importStudentLoader.value = false
      })
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
    updateClassDialog,
    incomplete,
    fda,
    remarks,
    dropped,
    grade,
    courseCode,
    subjectCode,
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
      //console.log("Update Grade Dialog box Opened");
      // if (remarks.value == "INCOMPLETE") {
      //   incomplete.value = true;
      // }
    } else if (updateGradeDialog.value == false) {
      //console.log("Update Grade Dialog Box Closed!");
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
    // if (updateClassDialog.value === false) {
    //   //console.log("Update Class dialog box closed");
    //   //updateClassForm.value?.reset();
    //   //initialize();
    // }
    if (courseCode.value?.code === undefined) {
      //console.log("course code undefined");
    } else {
      //console.log("Course Code Value: ", courseCode.value);
      getSubjectsByCourse(courseCode.value?.code);
      if (subjectCode.value) {
        //console.log("Subject: ", subjectCode.value);
        subjectDesc.value = subjectCode.value?.title;
        units.value = subjectCode.value?.units;
      }
    }
    // if (courseCode.value) {
    //   console.log("Course Code Value: ", courseCode.value)
    //   getSubjectsByCourse(courseCode.value?.code);
    //   if (subjectCode.value) {
    //     //console.log("Subject: ", subjectCode.value);
    //     subjectDesc.value = subjectCode.value?.title;
    //     units.value = subjectCode.value?.units;
    //   }
    // }

    // if (courseCode.value == )
  }
);

onMounted(async () => {
  await getActiveSchoolyear();
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

.card-outlined {
  border: 1px solid rgba(128, 128, 128, 0.2);
}
</style>
