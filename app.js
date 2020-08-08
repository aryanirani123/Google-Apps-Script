function ChangeColor(){

  
var sheet = SpreadsheetApp.getActiveSheet();
var range = sheet.getRange("D1:D10");
var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(4)
    .setBackground("red")
    .setRanges([range])
    .build();
var rules = sheet.getConditionalFormatRules();
rules.push(rule);
sheet.setConditionalFormatRules(rules);


var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(3)
    .setBackground("green")
    .setRanges([range])
    .build();
var rules = sheet.getConditionalFormatRules();
rules.push(rule);
sheet.setConditionalFormatRules(rules); 
  
  
  
  
}
