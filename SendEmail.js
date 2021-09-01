// This code is written in Google Apps Script 
// This code takes data from a Google Sheet and send Automated Emails to the students.
// Each email depends on the students grade. If a student recieves a bad grade, he will be sent a special email.
// To know more, check out the blog link: https://aryanirani123.medium.com/google-sheets-automation-using-google-apps-script-60c107ff6bcd



function sendEmail() {
  
  //Get the handle to the active spreadsheet & sheet.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var responses = ss.getSheetByName("Form Responses 1");
  
  //Get the data starting from values (i.e. skip the header row)
  var data = responses.getRange(2,1,responses.getLastRow() - 1,6).getValues();
  
  Logger.log(data);
  
  //Iterate each row of data
  data.forEach(function(row, i) {
    
    // variables
    var Marks = row[1]; // marks secured by the students
    var Name  = row[2]; // Name of the student
    var Email_ID = row[3];// Email address of the student
    var Roll_no  = row[4]; // Roll number of the student
   
    // only send reply if the replied column is still blank
      if (Marks <= 10){
        // send an email for marks less than equal to 10 
       var body =  formatEmailBody("Bad",Name, Marks,Email_ID,Roll_no);
      }

      else if (Marks <10) {
        // send an email for marks greater than 10

        var body =  formatEmailBody("Moderate",Name, Marks,Email_ID,Roll_no);
      }
      else if (Marks <= 15) {
        // send an email for marks greater than equal to 15
        var body =  formatEmailBody("good",Name, Marks,Email_ID,Roll_no);
      }

       else if (Marks <= 20) {
        // send an email marks greater than equal to 20
        var body =  formatEmailBody("Very Good",Name, Marks,Email_ID,Roll_no);
      }

      else if (Marks <= 25) {
        // send an email for marks greater than equal to 25
        var body =  formatEmailBody("Great",Name, Marks,Email_ID,Roll_no);
      }
      
      var subject = "Report for Maths Test";
      GmailApp.sendEmail(Email_ID, subject, "", { htmlBody: body } );

  });
  
}

function formatEmailBody(Rating, Name, Marks,Email_ID,Roll_no) {
                
      var emailTxt = "Teachers remarks: " + Rating + "<br><br>"+
            
                  " Name           :  "  + Name      + ",<br><br>"  +
                  " Score          :  "  + Marks     + "<br><br>" +
                  " Email Address  :  "  + Email_ID  + "<br><br>" +
                  " Roll Number    :   " + Roll_no   + "<br><br>";
  
  return emailTxt;
  
}
