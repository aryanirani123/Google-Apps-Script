function InsertData(){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Google Apps Script");

  var data = '=IMPORTHTML("https://en.wikipedia.org/wiki/List_of_Netflix_original_films_(2021)","table","1")';
  sheet.getRange('A1').setValue(data)

  Logger.log("Data has been pasted")

}
