function SendEmail(){

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Student Details");

  var data = sheet.getRange(2,1,sheet.getLastRow() - 1,2).getValues();
  //Logger.log(data);


  data.forEach(function(row,i){

    var name = row[0];
    var email = row[1];
    Logger.log(name)
    Logger.log(email)



  var body = "Dear "+ name + "<br><br>"+
  
        " It was noted with serious concern that quite a few students were detained last semester on account of attendance default. Despite monthly attendance information" + "<br><br>"+
        "being provided to students and regular counselling by faculty members, it is found that students do not take the attendance rules seriously. This results in losing an academic year affecting career" + "<br><br>"+  
        "prospects after graduation. It is also noted that students do not read the SRB and are not aware of the various rules and regulations and the repercussions of non-compliance."+ ",<br><br>" + 
        "Regards,"+ "<br><br>"+ 
        " XYZ University   " + "<br><br>";


     var subject = "Student Attendance";
    //GmailApp.sendEmail(email, subject, "", { htmlBody: body } );

    });




}
