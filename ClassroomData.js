function getData(){


  const classdata = Classroom.Courses.list().courses;

  //console.log(data);


  const data = classdata.map(c => {


    return [c.name, c.section,c.room,c.description,c.enrollmentCode];

  });


  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Sheet1");
  
  const START_ROW = 2;
  const START_COLUMN = 1;

  sheet.getRange(START_ROW,START_COLUMN,data.length,data[0].length).setValues(data);
  
}
