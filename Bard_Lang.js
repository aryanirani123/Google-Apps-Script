function BARD(sentence,origin_language,target_lanugage) {
  var apiKey = "AIzaSyBkWRCIRP5kMEhfGFa38PRA10mVc2t8oOE";
  var apiUrl = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText";
  var url = apiUrl + "?key=" + apiKey;
  var headers = {
    "Content-Type": "application/json"
  };

    var prompt = {

      'text': "Convert this sentence"+ sentence + "from"+origin_language + "to"+target_lanugage

    }

  var requestBody = {

    "prompt": prompt
  }


  var options = {
    "method": "POST",
    "headers": headers,
    "payload": JSON.stringify(requestBody)
  };
  var response = UrlFetchApp.fetch(url, options);
  var data = JSON.parse(response.getContentText());
  var output = data.candidates[0].output;
  Logger.log(output);
  return output;
  
}
