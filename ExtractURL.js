function extractAndPasteLinks() {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Get the number of rows with data in column B
  var lastRow = sheet.getLastRow();
  
  for (var i = 2; i <= lastRow; i++) {
    var cell = sheet.getRange(i, 2); 
    var richTextValue = cell.getRichTextValue(); // Get the rich text value
    
    if (richTextValue) {
      var runs = richTextValue.getRuns(); // Get the runs (segments of text)
      for (var j = 0; j < runs.length; j++) {
        var url = runs[j].getLinkUrl(); // Get the URL from the text run
        if (url) {
          sheet.getRange(i, 3).setValue(url); // Paste the URL in Column C
          break; // Stop after the first URL is found
        }
      }
    }
  }
}
