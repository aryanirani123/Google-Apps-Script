function create_Events(){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Calendar_Events");
  var last_row = sheet.getLastRow();
  var data = sheet.getRange("A1:E" + last_row).getValues();
  var cal = CalendarApp.getCalendarById("aryanirani123@gmail.com");
  //Logger.log(data);

  for(var i = 0;i< data.length;i++){
    // index 0 = Name of the Event 
    // index 1 = Start Time of the Event
    // index 2 = End Time of the Event
    // index 3 = Location of the Event 
    // index 4 = Description of the Event 
    // index 5 = Attendess of the Event 

    var Events = cal.createEvent(data[i][0],
    new Date(data[i][1]),
    new Date(data[i][2]),
    {location: data[i][3], description : data[i][4]});    
 //Logger.log('Event ID: ' + event.getId());

  }  
  Logger.log("Events have been added to the calendar");

}
