function doGet(e) {

  var htmlOutput =  HtmlService.createTemplateFromFile('file');
  htmlOutput.search = '';
  return htmlOutput.evaluate();
}
  
