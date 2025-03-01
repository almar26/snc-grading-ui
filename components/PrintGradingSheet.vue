<template>
  <div>
    <v-btn icon color="green" size="small" class="text-capitalize my-4" @click="generatePDF">
      <v-icon size="large">mdi-printer</v-icon>
      <v-tooltip activator="parent" location="top">Print</v-tooltip>
    </v-btn>
  </div>
</template>

<script setup>
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
const pdfContent = ref(null);

const props = defineProps(["studentSubjectList", "classDetails", "userData"]);

async function generatePDF() {
  var pdf = new jsPDF();

  // Add Header
  var img = new Image();
  img.src = `/SNC-Logo.png`;
  const pageWidth = pdf.internal.pageSize.getWidth();
  //const pageWithNew = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = 22;
  const imgHeight = 22;

  const x = (pageWidth - imgWidth) / 2;
  const y = (pageHeight - imgHeight) / 2;

  pdf.addImage(img, 'png', x, 7, imgWidth, imgHeight);


  pdf.setGState(new pdf.GState({ opacity: 0.15 }));
  pdf.addImage(img, "PNG", 55, 100, 100, 100, undefined, "SLOW")

  pdf.setGState(new pdf.GState({ opacity: 1 }));
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  pdf.text("ST. NICOLAS COLLEGE OF BUSINESS AND TECHNOLOGY", pageWidth / 2, 36, { align: 'center' });

  const text = "Mel-Vi Bldg., JASA Road, Dolores, City of San Fernando, Pampanga";
  const maxWidth = 80; // Maximum width of the text
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.setFont(undefined, 'normal');
  pdf.text(lines, pageWidth / 2, 41, { align: 'center' })

  // Add a line
  // pdf.setLineWidth(0.5)
  // pdf.line(0, 49, 210, 49)

  pdf.setFontSize(13);
  //pdf.setTextColor(76, 175, 80);
  pdf.setFont(undefined, 'bold');
  pdf.text("SYSTEM GRADING SHEET", pageWidth / 2, 56, { align: 'center' })

  // Add Student Information
  // student label
  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont(undefined, 'bold');
  // Subject Code
  pdf.text("SUBJECT CODE", 10, 65)
  pdf.text(":", 34, 65)
  // Subject Desc
  pdf.text("SUBJECT DESC", 10, 70)
  pdf.text(":", 34, 70)
  // Course Code
  pdf.text("COURSE CODE", 10, 75)
  pdf.text(":", 34, 75)
  // Section
  pdf.text("SECTION", 10, 80)
  pdf.text(":", 34, 80)
  // Units
  pdf.text("UNITS", 10, 85)
  pdf.text(":", 34, 85)

  // Faculty ID
  pdf.text("FACULTY ID", 115, 65)
  pdf.text(":", 139, 65)
  // Faculty Name
  pdf.text("FACULTY NAME", 115, 70)
  pdf.text(":", 139, 70)
  // Semester
  pdf.text("SEMESTER", 115, 75)
  pdf.text(":", 139, 75)
  // School Year
  pdf.text("SCHOOL YEAR", 115, 80)
  pdf.text(":", 139, 80)

  // Class Details Data
  // const units = props.classDetails.units
  pdf.setFont(undefined, 'normal');
  pdf.text(props.classDetails.subject_code, 37, 65)
  pdf.text(props.classDetails.subject_description, 37, 70)
  pdf.text(props.classDetails.course_code, 37, 75)
  pdf.text(props.classDetails.section, 37, 80)
  pdf.text(`${props.classDetails.units}`, 37, 85)
  pdf.text(props.userData.username, 142, 65)
  pdf.text(`${props.userData.first_name} ${props.userData.last_name}`, 142, 70)
  let upperSemester = props.classDetails.semester.toUpperCase();
  pdf.text(upperSemester, 142, 75);
  pdf.text(props.classDetails.school_year, 142, 80)


  // Table for Student List
  const columns = [
    { header: 'STUDENT NO', dataKey: 'student_no' },
    { header: 'LASTNAME', dataKey: 'last_name' },
    { header: 'FIRSTNAME', dataKey: 'first_name' },
    { header: 'MIDDLENAME', dataKey: 'middle_name' },
    { header: 'FINAL', dataKey: 'grade' },
    { header: 'NUMERIC', dataKey: 'numeric_grade' },
    { header: 'REMARKS', dataKey: 'remarks' },
  ];

  const data = props.studentSubjectList;
  const class_data = props.classDetails
  console.log("Student List Result: ", data)
  console.log("Class Details: ", class_data)

  pdf.autoTable(
    {
      startY: 90,
      columns,
      body: data,
      theme: 'grid',
      didDrawPage: function (data) {
        if (data.table.body.length === 0) {
          pdf.setFontSize(12);
          pdf.text("No Data Available", 105, 110, null, null, "center");
        }
      },
      styles: {
        halign: "center",
        textColor: [0, 0, 0], // RGB color for text
        font: 'helvetica',
        fontSize: 7,
        lineColor: [0, 0, 0],
        fillColor: null,
        cellPadding: 1
      },
      headStyles: {
        fillColor: [76, 175, 80], // RGB color for header background
        textColor: [255, 255, 255], // RGB color for header text
        fontSize: 9,
        fontStyle: 'bold',
      },
      margin: { left: 10, right: 10 }
    }
  );

  // const finalY = pdf.lastAutoTable.finalY;
  // pdf.text("Second line of text", 1, finalY + 10);

  pdf.autoPrint();
  var w = 600;
  var h = 600;
  var left = (window.innerWidth / 2) - (w / 2);
  var top = (window.innerHeight / 2) - (h / 2);
  window.open(pdf.output('bloburl'), '_blank', 'modal,location=no,menubar=no, scrollbars=no,titlebar=no,toolbar=no,top=' + top + ',left=' + left + ',width=' + w + ',height=' + h + '');
}

</script>

<style>
.pdf-content {
  display: none;
  /* Prevents the content from showing on the page */
}
</style>