function getEvents(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("GetEvents");

  var cal = CalendarApp.getCalendarById("aryanirani123@gmail.com");
  var events = cal.getEvents(new Date("6/27/2021 12:00 AM"), new Date("6/30/2021 11:59 PM"));

  for(var i = 0;i<events.length;i++){
    var title = events[i].getTitle();
    var start_time = events[i].getStartTime();
    var end_time = events[i].getEndTime();
    var loc = events[i].getLocation();
    var des = events[i].getDescription();

    sheet.getRange(i+2,1).setValue(title);
    sheet.getRange(i+2,2).setValue(start_time);
    sheet.getRange(i+2,3).setValue(end_time);
    sheet.getRange(i+2,4).setValue(loc);
    sheet.getRange(i+2,5).setValue(des);
  }

  Logger.log("Events have been added to the Spreadsheet");
}
