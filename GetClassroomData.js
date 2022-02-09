//This code is written in Google Apps Script
// This code gets all the data in the Google Classroom into your Google Sheet using Google Apps Script and the Google Classroom API.

function getData(){


  const CLASS_DATA = Classroom.Courses.list().courses;

  //console.log(CLASS_DATA);


  const DATA = CLASS_DATA.map(c => {

    return [c.name, c.section,c.room,c.description,c.enrollmentCode];
  });


  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Sheet1");

  const START_ROW = 2;
  const START_COLUMN = 1

  sheet.getRange(START_ROW,START_COLUMN,DATA.length,DATA[0].length).setValues(DATA);
  
}
