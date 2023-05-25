function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('Custom Menu')
      .addItem('Summarize selected paragraph', 'summarizeSelectedParagraph')
      .addToUi();
}

var API_key = "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";


function generateSummary(paragraph){

  var Model_ID = "text-davinci-002";
  var maxtokens = 200;
  var temperature = 0.7;
  

  var payload = {

    'model': Model_ID,
    'prompt': 'Please generate a short summary for:\n' +paragraph,
    'temperature': temperature,
    'max_tokens': maxtokens,
    "presence_penalty": 0.5,
    "frequency_penalty": 0.5

  }

  var options = {

    "method": "post",
    "headers": {

      "Content-Type": "application/json",
      "Authorization" : "Bearer " + API_key
    },
    "payload": JSON.stringify(payload)
  };


  var response = UrlFetchApp.fetch("https://api.openai.com/v1/completions",options);
  var summary = JSON.parse(response.getContentText());
  return summary.choices[0].text.trim();



}


function summarizeSelectedParagraph() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  var text = selection.getRangeElements()[0].getElement().getText();
  var summary = generateSummary(text);
  DocumentApp.getActiveDocument().getBody().appendParagraph("Summary")
  DocumentApp.getActiveDocument().getBody().appendParagraph(summary);
}
