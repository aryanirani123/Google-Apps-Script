function onFormSubmit(e){

  var reviewtext = e.namedValues["Describe your Experience "];
  var apiKey = "your_api_key";
  var apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
  var url = apiUrl +"?key="+apiKey;

  var headers = {
    "Content-Type": "application/json"

  };

  var requestBody = {
    "contents": [
        {
            "parts": [
                {
                    "text": "Identify the items that the reviewer liked and did not like. Please categorise them in different lists, nicely formatted"+reviewtext
                }
            ]
        }
    ]
};
  var options = {

    "method": "POST",
    "headers": headers,
    "payload": JSON.stringify(requestBody)
  };

  var response = UrlFetchApp.fetch(url,options);
  var data = JSON.parse(response.getContentText());
  var output = data.candidates[0].content.parts[0].text
  Logger.log(output);





}
