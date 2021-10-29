//This code is written in Google Apps Script(JavaScript). 
//This code changes the colours of cells in Google Sheets on meeting the given criteria. 
//In this example, if the number in the cell is greater than 3, the cell colour to green. 

function ChangeColor(){

const sheet = SpreadsheetApp.getActiveSheet();
const range = sheet.getRange("D1:D10");
const rule = SpreadsheetApp.newConditionalFormatRule()
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
