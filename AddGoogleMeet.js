// This code is wriiten in Google Apps Script(JavaScript)
// This code creates Calendar Events with Google Meet
// All the details regarding the events is stored in a Google Sheet
// The code takes the details from the sheet and creates events in Google Calendar

function createNewEventWithMeet() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Calendar_Events");
  var last_row = sheet.getLastRow();
  var data = sheet.getRange("A2:E" + last_row).getValues();
  var cal = CalendarApp.getCalendarById("aryanirani123@gmail.com");

  for(var i = 0;i< data.length;i++){

    var event_name = data[i][0];
    var start_time = data[i][1];
    var end_time = data[i][2];
    var event_description = data[i][3];
    var attendees_event = data[i][4];

  const gmt = "+05:30";
  const calendarId = "aryanirani123@gmail.com";
  const resource = {
    start: { dateTime: start_time+gmt },
    end: { dateTime: end_time+gmt },
    attendees: [{ email: attendees_event }],
    conferenceData: {
      createRequest: {
        requestId: "sample123",
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    summary: event_name,
    description: event_description,
  };
  const res = Calendar.Events.insert(resource, calendarId, {
    conferenceDataVersion: 1,
  });
  var googleMeet_Link = res.hangoutLink;
  
  console.log(res);
  }
}
