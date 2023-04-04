function GetDirection(){

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");

  var start = sheet.getRange("A2").getValue();
  var end = sheet.getRange("B2").getValue();


  var directions = Maps.newDirectionFinder()
  .setOrigin(start)
  .setDestination(end)
  .setMode(Maps.DirectionFinder.Mode.DRIVING)
  .getDirections();

  Logger.log(directions.routes[0].legs[0].duration.text);
  Logger.log(directions.routes[0].legs[0].distance.text);
}
