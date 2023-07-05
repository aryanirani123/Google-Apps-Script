function getPalmData() {
  var apiKey = "your_api_key";
  var apiUrl = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText"; 
  
  var url = apiUrl + "?key=" + apiKey;
  
  var headers = {
    "Content-Type": "application/json"
  };
  
  var prompt = {
    "text": "Write a story about a magic backpack"
  };
  
  var requestBody = {
    "prompt": prompt
  };
  
  var options = {
    "method": "POST",
    "headers": headers,
    "payload": JSON.stringify(requestBody)
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var data = JSON.parse(response.getContentText());
  
  Logger.log(data); 
}

