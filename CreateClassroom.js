// This code is wriiten in Google Apps Script(JavaScript)
// This code creates nulk Google Classroom using Google Apps Script
// The Classes are created provided the following data is present in the Google Sheet
/*
    (1) Name of the Class
    (2) Section of the Class
    (3) Room
    (4) Description of the Class
*/

// On successful execution, the Class code will be pasted in the Google Sheet. 
function onOpen(){

  const menu = SpreadsheetApp.getUi().createMenu('Custom');
  menu.addItem('Create Clasroom','createClasses');
  menu.addToUi();
}

function ClassData(ClassData){

  console.log("Aryan Irani");

  let crs = Classroom.newCourse();
  crs.name = ClassData.name;
  crs.description = ClassData.descr;
  crs.room = ClassData.room;
  crs.ownerId = "aryanirani123@gmail.com";
  const createdCourse = Classroom.Courses.create(crs);
  return createdCourse.enrollmentCode;

}

function createClasses(){

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Sheet2") ;
  const data = sheet.getRange(2,1,sheet.getLastRow()-1,4).getValues();

  const enrollmentCodes = [];
  data.forEach( r=>{
    
    let eCode = ClassData({
      
      name:r[0],
      section: r[1],
      descr: r[3],
      room: r[2],
      
      
      });

      enrollmentCodes.push([eCode]);

      sheet.getRange(2,5, enrollmentCodes.length,1).setValues(enrollmentCodes);
    
  });


}
