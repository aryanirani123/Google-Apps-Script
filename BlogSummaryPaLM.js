function onOpen(){

  var ui = DocumentApp.getUi();
  ui.createMenu('Custom Menu')
      .addItem('Summarize Selected Paragraph', 'summarizeSelectedParagraph')
      .addToUi();

}

function DocSummary(paragraph){

  var apiKey = "your_api_key";
  var apiUrl = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText"; 

  var url = apiUrl + "?key=" + apiKey;

  var headers = {

    "Content-Type": "application/json"
  }

  var prompt = {

    'text': "Please generate a short summary for :\n" + paragraph
  }

  var requestBody = {
    "prompt": prompt
  }

  var options = {

    "method": "POST",
    "headers": headers,
    "payload": JSON.stringify(requestBody)

  }

  var response = UrlFetchApp.fetch(url,options);
  var data = JSON.parse(response.getContentText());
  return data.candidates[0].output;


}

function summarizeSelectedParagraph(){

  var selection = DocumentApp.getActiveDocument().getSelection();
  var text = selection.getRangeElements()[0].getElement().getText();
  var summary = DocSummary(text);
  DocumentApp.getActiveDocument().getBody().appendParagraph("Summary");
  DocumentApp.getActiveDocument().getBody().appendParagraph(summary)


}
