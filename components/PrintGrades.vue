<template>
  <div>
    <!-- <div class="pdf-content">
      <div id="content" ref="pdfContent" style="width: 30vw;">
        <h1>JSPDF Content asd ad ad ad ads asd asd ads asd</h1>
        {{ studentid }}
      </div>
    </div> -->
    <v-btn prepend-icon="mdi-printer" variant="outlined" color="green" @click="generatePDF"
      class="text-capitalize my-4">
      Print
    </v-btn>
  </div>
</template>

<script setup>
import $ from 'jquery'
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'
const pdfContent = ref(null)

// const props = defineProps({
//   studentid: String,
//   studentDetails: Object,
//   gradeResult: Array
// })
const props = defineProps(['studentid', 'studentDetails', 'gradeResult', 'schoolYear', 'semester'])

async function generatePDF() {
  //OPTION 1

  var pdf = new jsPDF();

  // Add Header
  var img = new Image();
  img.src = '/SNC-Logo.png';

  pdf.addImage(img, 'png', 15, 7, 22, 22);
  var pageHeight = pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
  var pageWidth = pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();

  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text("ST. NICOLAS COLLEGE OF BUSINESS AND TECHNOLOGY", pageWidth / 2, 15, { align: 'center' });

  const text = "Mel-Vi Bldg., JASA Road, Dolores, City of San Fernando, Pampanga";
  const maxWidth = 80; // Maximum width of the text
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.setFont(undefined, 'normal');
  pdf.text(lines, pageWidth / 2, 20, { align: 'center' })

  // Add a line
  pdf.setLineWidth(0.5)
  pdf.line(0, 33, 210, 33)

  // TITLE
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text("REPORT CARD", pageWidth / 2, 42, { align: 'center' })

  // Add Student Information
  // student label
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'bold');
  // Student No.
  pdf.text("STUDENT NO", 15, 50)
  pdf.text(":", 42, 50)
  // Lastname
  pdf.text("LASTNAME", 15, 56)
  pdf.text(":", 42, 56)
  // Firstname
  pdf.text("FIRSTNAME", 15, 62)
  pdf.text(":", 42, 62)
  // Middlename
  pdf.text("MIDDLENAME", 15, 68)
  pdf.text(":", 42, 68)
  // Course
  pdf.text("COURSE", 120, 50)
  pdf.text(":", 145, 50)
  // Major
  // pdf.text("MAJOR", 100, 48)
  // pdf.text(":", 125, 48)
  // School Year
  pdf.text("SCHOOL YEAR", 120, 56)
  pdf.text(":", 145, 56)
  // Semester
  pdf.text("SEMESTER", 120, 62)
  pdf.text(":", 145, 62)

  // Student Info Data
  pdf.setFont(undefined, 'normal');
  pdf.text(props.studentDetails.student_no, 47, 50)
  pdf.text(props.studentDetails.last_name, 47, 56)
  pdf.text(props.studentDetails.first_name, 47, 62)
  pdf.text(props.studentDetails.middle_name, 47, 68)
  pdf.text(props.studentDetails.course_code, 150, 50)
  pdf.text(props.schoolYear, 150, 56)
  let semesterText = props.semester
  let upperSemester = props.semester.toUpperCase();
  pdf.text(upperSemester, 150, 62)

  // Footer
  pdf.text("SNC Grading System", pageWidth / 2, pageHeight  - 10, { align: 'center' });

  // Add a line
  // pdf.setLineWidth(0.8)
  // pdf.setLineDashPattern([3, 3, 1, 3], 10)
  // pdf.line(15, 75, 196, 75)

  pdf.setLineDashPattern(0)
  const columns = [
    { header: 'Code', dataKey: 'subject_code' },
    { header: 'Description', dataKey: 'title' },
    { header: 'Units', dataKey: 'unit' },
    { header: 'Grade', dataKey: 'grade' },
    { header: 'Numeric Grade', dataKey: 'numeric_grade' },
    { header: 'Remarks', dataKey: 'remarks' },
  ];
  const data = props.gradeResult;

  // pdf.setY(30);
  // Add table to the PDF
  pdf.autoTable(
    {
      startY: 75,
      columns,
      body: data,
      theme: 'grid'
    });

  pdf.autoPrint();
  var w = 600;
  var h = 300;
  var left = (window.innerWidth / 2) - (w / 2);
  var top = (window.innerHeight / 2) - (h / 2);
  window.open(pdf.output('bloburl'), '_blank', 'modal,location=no,menubar=no, scrollbars=no,titlebar=no,toolbar=no,top=' + top + ',left=' + left + ',width=' + w + ',height=' + h + '');
}

async function printGrades() {
  console.log("Grade Result: ", props.gradeResult)
  // OPTION 1
  var pdf = new jsPDF('p', 'pt', 'a4', true);
  let source = $('#content')[0];
  //const content = pdfContent.value;
  let margins = {
    top: 20,
    left: 20,
    width: 522
  };
  pdf.html(
    source, // HTML string or DOM elem ref.
    {
      callback: function (pdf) {
        pdf.text("Hello, this is a PDF preview!", 10, 10);
        // Table columns and data
        const columns = [
          { header: 'Code', dataKey: 'subject_code' },
          { header: 'Description', dataKey: 'title' },
          { header: 'Units', dataKey: 'unit' },
          { header: 'Grade', dataKey: 'grade' },
          { header: 'Numeric Grade', dataKey: 'numeric_grade' },
          { header: 'Remarks', dataKey: 'remarks' },
        ];
        const data = props.gradeResult;

        // Add table to the PDF
        pdf.autoTable({
          columns,
          body: data,
        });
        pdf.autoPrint();
        var w = 600;
        var h = 300;
        var left = (window.innerWidth / 2) - (w / 2);
        var top = (window.innerHeight / 2) - (h / 2);
        window.open(pdf.output('bloburl'), '_blank', 'modal,location=no,menubar=no, scrollbars=no,titlebar=no,toolbar=no,top=' + top + ',left=' + left + ',width=' + w + ',height=' + h + '');
        // pdf.save("sample-pdf.pdf")
      },
      x: margins.left,
      y: margins.top
    }
  )
}

</script>

<style>
.pdf-content {
  display: none;
  /* Prevents the content from showing on the page */
}
</style>