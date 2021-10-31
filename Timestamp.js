// This code is wriiten in Google Apps Script(JavaScript)
// This code adds timestamp to Google Sheets as soon as a change is made to a specified column
function onEdit(e){

  const row = e.range.getRow();
  const col = e.range.getColumn();


  const sheetName = "Sheet1";
  if (col === 1 && row > 1 && e.source.getActiveSheet().getName() === "Sheet1"){
    
    const currentDate = new Date();
    e.source.getActiveSheet().getRange(row,4).setValue(currentDate);
    const name = Session.getActiveUser().getEmail();

    e.source.getActiveSheet().getRange(row,5).setValue(name)

    if(e.source.getActiveSheet().getRange(row,3).getValue() == ""){
      
      e.source.getActiveSheet().getRange(row,3).setValue(currentDate);
      
    }
  
  }
  
}

