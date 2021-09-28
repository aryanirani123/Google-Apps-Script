/*
This code is wriiten in Google Apps Script(JavaScript)
This code creates nulk Google Classroom using Google Apps Script
The Classes are created provided the following data is present in the Google Sheet

    (1) Name of the Class
    (2) Section of the Class
    (3) Room
    (4) Description of the Class

*/

function onOpen(){

  const menu = SpreadsheetApp.getUi().createMenu('Custom');
  menu.addItem('Create Classroom','createClasses');
  menu.addToUi();

}

function classroomdata(classname,section,room,descr){

  const ownerEmail = "aryanirani123@gmail.com";
  const crs = Classroom.newCourse();
  crs.name = classname;
  crs.section = section;
  crs.description = descr;
  crs.room = room;
  crs.ownerId = ownerEmail;

  const createdCourse = Classroom.Courses.create(crs);
  return createdCourse.enrollmentCode;
  
}

function createClasses(){

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "Sheet2";
  const sheet = ss.getSheetByName(sheetName);

  const startRow = 2;
  const startColumn = 1;
  const last_Column = 4;
  const data = sheet.getRange(startRow,startColumn,sheet.getLastRow()-1,last_Column).getValues();

  const enrollmentCodes = [];

    const nameIndex = 0;
    const sectionIndex = 1;
    const roomIndex = 2
    const descriptionIndex = 3;

    const rowStart = 2;
    const columnStart = 5;
    const columnLast = 1;
    
  data.forEach( row=>{
    let eCode = classroomdata(  

      name = row[nameIndex],
      section = row[sectionIndex],
      room =  row[roomIndex],
      descr = row[descriptionIndex],
      
      );

      enrollmentCodes.push([eCode]);

      sheet.getRange(rowStart,columnStart, enrollmentCodes.length,columnLast).setValues(enrollmentCodes);
    
  });

}
