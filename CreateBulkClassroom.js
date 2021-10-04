/*
This code is wriiten in Google Apps Script(JavaScript)
This code creates nulk Google Classroom using Google Apps Script
The Classes are created provided the following data is present in the Google Sheet

    (1) Name of the Class
    (2) Section of the Class
    (3) Room
    (4) Description of the Class

*/
OWNER_EMAIL = "aryanirani123@gmail.com"; //Don't forget to update this value with your email address :)

function onOpen(){
    const menu = SpreadsheetApp.getUi().createMenu('Custom');
    menu.addItem('Create Classroom','createClasses');
    menu.addToUi();
}
function classroomData(properties){
    
    const crs = Classroom.newCourse();
    Object.keys(properties).forEach(key => {
        Crs[key] = properties[key];
    })
    const createdCourse = Classroom.Courses.create(crs);
    return createdCourse.enrollmentCode;
}
function createClasses(){
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    const START_ROW= 2;
    const START_COLUMN = 1;
    const LAST_COLUMN= 4;
    const data = sheet.getRange(
        START_ROW,
        START_COLUMN,
        sheet.getLastRow()-1,
        LAST_COLUMN).getValues();
    const enrollmentCodes = [];
    const nameIndex = 0;
    const sectionIndex = 1;
    const roomIndex = 2
    const descriptionIndex = 3;
    const START_COLUMN = 5;
    const LAST_COLUMN = 1;
    data.forEach(row => {
        const eCode = classroomData({
            name: row[nameIndex],
            section: row[sectionIndex],
            room: row[roomIndex],
            description: row[descriptionIndex],
            ownerId: OWNER_EMAIL
        });
        enrollmentCodes.push([eCode]);
        sheet.getRange(
            START_ROW,
            COLUMN_START,
            enrollmentCodes.length,
            COLUMN_LAST).setValues(enrollmentCodes);
    });
}
