var API_key = "your_api_key";

function BlogSummary(){

  var Model_ID = "text-davinci-002";
  var maxtokens = 200;
  var temperature = 0.7;


  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");
  var urls = sheet.getRange("A2:A6").getValues()

  for(var i=0; i<urls.length;i++){

    var url = urls[i][0]


    var payload = {

      'model': Model_ID,
      'prompt': 'Please generate a 50 word summary for the following blog post:\n'+url,
      'temperature': temperature,
      'max_tokens':maxtokens,
      "presence_penalty": 0.5,
      "frequency_penalty": 0.5

    }

    var options = {

      "method": "post",
      "headers": { 

        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_key

      },
      "payload": JSON.stringify(payload)
    }

    var response = UrlFetchApp.fetch("https://api.openai.com/v1/completions",options);
    var summary = JSON.parse(response.getContentText());
    var final_summary = summary.choices[0].text.trim();


    var doc = DocumentApp.create("Summary of Blog Post #"+ (i+1));
    var body = doc.getBody();
    body.appendParagraph(final_summary);

    var docUrl = doc.getUrl();
    sheet.getRange(i+2,2).setValue(docUrl);


  }


}
