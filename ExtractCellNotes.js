// This code is written in Google Apps Script
// This code extract cell notes and pastes them in the adjacent cell
// This makes it easier for the user to read the cell notes

function getNote()
{
// Get the sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
// Get the data from the sheet 
  var range = sheet.getDataRange();
// Get the notes from the sheet
  var notes = range.getNotes();

  for(var i = 0;i < notes.length;i++){
    for (var j = 0; j < notes[0].length; j++){
// If note is not empty
      if(notes[i][j]){
        var note = notes[i][j];
        var cell = range.getCell(i+1,j+1);
        cell.offset(0,1).setValue(note);
      }
    }
  }
}
