/*
Resource Link: 1gSSQkAeAjvj7qwZZYpe7jHC2xENAViNEbE_7ATNVOtA
3 departments: Admin,HR,Software
Admin = Editor Access
HR = Commentor Access
Software = Viewer Access
*/

var ROW = 2;
var COL = 2;
var ROW_NUM = 5
var COL_NUM = 1;

function giveAccess(){

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Sheet1");
  const link = sheet.getRange(ROW,COL).getValue();
  //Logger.log(link)
  const range = sheet.getRange(ROW_NUM,COL_NUM,sheet.getLastRow(),2);
  const data = range.getValues();
  //Logger.log(data);

  const file = DriveApp.getFileById(link);
  const file_type = file.getMimeType();
  //Logger.log(file_type)
  //Logger.log("Success")

  data.forEach(function(row,i){
    var role = row[1]
    var email = row[0]

    if(role == "Admin"){
      file.addEditor(email);
      Logger.log("File shared with Editor access to Admin Department")
    }
    
    else if(role == "HR"){
      file.addCommenter(email);
      Logger.log("File shared with Commentor access to HR Department")
    }

    else if(role == "Software"){
      file.addViewer(email);
      Logger.log("File shared with Viewer access to Software Team")
    }
  });

}
