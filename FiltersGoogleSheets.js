// This code is written in Google Apps Script(JavaScript)
// This code creates Filters in Google Sheets\
// The filter criterias are specified in the code


function create_filter(){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet1 = ss.getSheetByName("Filter_Sheet");
  var range = sheet1.getRange("A:D");

  var filter = range.createFilter();

  var Filter_Criteria1 = SpreadsheetApp.newFilterCriteria().whenNumberGreaterThan(500);
  var Filter_Criteria2 = SpreadsheetApp.newFilterCriteria().whenTextContains(['India/Mumbai']);

  var add_filter1 =filter.setColumnFilterCriteria(3,Filter_Criteria1);
  var add_filter2 = filter.setColumnFilterCriteria(4,Filter_Criteria2);

  Logger.log("Filter has been added.");

  var range = sheet1.getDataRange();

  var new_sheet = ss.insertSheet();
  new_sheet.setName("India/Mumbai Data");

  range.copyTo(new_sheet.getRange(1,1));

}
