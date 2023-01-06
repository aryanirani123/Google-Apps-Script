//This code creates a Google Doc Report from your data in Google Sheets automatically using the Document App and Google Drive App


function main(){

  //Get the Google Sheet and Values
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Inventory")
  const data = sheet.getDataRange().getValues();

  //Get the Google Drive Folder 
  const folder_id = "1ZSZO2-jnmJoTYFAtqOyMg7duD-d2koPs";
  const folder = DriveApp.getFolderById(folder_id);


  //Create the Google Doc 
  const doc = DocumentApp.create("Inventory Report");
  const id = doc.getId();

  //Move the Doc to the Folder 
  var file = DriveApp.getFileById(id);
  file.moveTo(folder);

  //Add values to the Google Doc
  var body = doc.getBody();
  table = body.appendTable(data);
}
