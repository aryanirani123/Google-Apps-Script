function calculateDistances() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");
  var numRows = sheet.getDataRange().getNumRows();
  var data = sheet.getRange("A2:B" + numRows).getValues();
  var status_column = 5; 

  for (var i = 0; i < data.length; i++) {
    var start = data[i][0];
    var end = data[i][1];
    var flag = data[i][4];


    if (start && end && flag !== "done") {
      var directions = Maps.newDirectionFinder()
        .setOrigin(start)
        .setDestination(end)
        .setMode(Maps.DirectionFinder.Mode.DRIVING)
        .getDirections();
      
      var distance = directions.routes[0].legs[0].distance.text;
      var duration = directions.routes[0].legs[0].duration.text;
      
      sheet.getRange(i+2, 3).setValue(distance);
      sheet.getRange(i+2, 4).setValue(duration);
      sheet.getRange(i+2, 5).setValue("done");

    }
  }
}
