// This Code is written in Google Apps Script
// This code sends out Bulk Emails
// The Data for Bulk emails is being extracted from two Google Sheets.
// The First Google Sheet contains the data to be sent, and the second Google Sheets contains the email addresses of the recipients.



function sendEmail() {
  
  // Get handle to active spreadsheet and sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var responses1 = ss.getSheetByName("Sheet1");
  var responses2 = ss.getSheetByName("Sheet2");
  
  // Getting data from the sheets
  var data1 = responses1.getRange(2,1,2,3).getValues(); // Getting the subject, body and the footer from the sheet 
  var data2 = responses2.getRange(2,3,responses2.getLastRow() - 1,4).getValues(); // Getting the email address of the residents 

  //Row 1 and Col 1  
  var EmailSubject = data1[0][0]; 
  var EmailBody    = data1[0][1];
  var EmailFooter  = data1[0][2];
  
  data2.forEach(function (row,i) {
    MailApp.sendEmail(row[1],EmailSubject,'Dear ' + row[0] + ',\n\n' + EmailBody + '\n\n' + EmailFooter);
  });
  
}
