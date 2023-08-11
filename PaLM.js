function BARD(prompt) {
  var apiKey = "your_api_key";
  var apiUrl = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
  var url = apiUrl + "?key=" + apiKey;
  var headers = {
    "Content-Type": "application/json"
  };
  var requestBody = {
    "prompt": {
      "text": prompt
    }
  };
  var options = {
    "method": "POST",
    "headers": headers,
    "payload": JSON.stringify(requestBody)
  };
  var response = UrlFetchApp.fetch(url, options);
  var data = JSON.parse(response.getContentText());
  var output = data.candidates[0].output;
  //return generatedText;
  Logger.log(output);
  return output;
  
}
