/ Replace with your OpenAI API key
var API_KEY = "your_api_key";


function GPT(prompt) {

  var Model_ID = "text-davinci-002";
  var maxTokens = 64;
  var temperature = 0.5;
  // Build the API payload
var payload = {
  'model': 'text-davinci-002', // or your desired model
  'prompt': prompt,
  'temperature': temperature,
  'max_tokens': maxTokens,
};

  // Build the API options
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + API_KEY
    },
    "payload": JSON.stringify(payload)
  };

  // Make the API request
  var response = UrlFetchApp.fetch("https://api.openai.com/v1/completions", options);

  // Parse the response and return the generated text
  var responseData = JSON.parse(response.getContentText());
  return responseData.choices[0].text.trim();
}
