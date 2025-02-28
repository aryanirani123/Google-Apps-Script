function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('PodcastGenPro')
    .addItem('Launch Sidebar', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('PodcastGeneratorPro')
    .setWidth(800);
  DocumentApp.getUi().showSidebar(html);
}

function getSelectedText() {
  var doc = DocumentApp.getActiveDocument();
  var selection = doc.getSelection();
  if (selection) {
    var elements = selection.getRangeElements();
    var selectedText = elements.map(function (element) {
      return element.getElement().asText().getText();
    }).join("\n");
    return selectedText;
  }
  return "";
}
function sendToGemini(selectedText) {
  const GEMINI_KEY = 'AIzaSyBiZJcG-pviBRtb8SauUYIQfqaWS2qC8jU';
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`;

  var headers = {
    "Content-Type": "application/json",
  };

  var requestBody = {
    "contents": [
      {
        "parts": [
          {
            "text": `You are an AI scriptwriter for a podcast called *The Machine Learning Engineer*. Your task is to generate a natural, engaging, and dynamic podcast script in a conversational format between two speakers: Marina and Sascha. The discussion should feel spontaneous and lively, with realistic interactions. The output should be in Hindi langauge
              Use the following format:
              [
                  {
                    "speaker": "Marina",
                    "text": "<Marina's opening line>"
                  },
                  {
                    "speaker": "Sascha",
                    "text": "<Sascha's response>"
                  },
                        ]
                  ### Topic:
                  ${selectedText}

                  Use the information provided above as the core discussion material for this episode. Marina will introduce the topic, and Sascha will explain it in detail, with back-and-forth interactions that make the conversation engaging.

                  ### Tone & Style:
                  - Friendly, engaging, and conversational.
                  - Natural flow, like two experts chatting informally.
                  - Keep it dynamic with occasional expressions of surprise, humor, or curiosity.

                  ### Instructions for Response:
                  - The response should be a structured JSON list of dialogue exchanges.
                  - Maintain a lively discussion with a smooth flow of ideas.
                  - Ensure Sascha provides clear and engaging explanations while Marina asks insightful follow-up questions.

                  Return the response in the specified JSON format, ensuring it stays structured correctly while keeping the dialogue engaging and informative.
`         
 }
    ]
  }
    ]
};

var options = {
  "method": "POST",
  "headers": headers,
  "payload": JSON.stringify(requestBody),
  "muteHttpExceptions": true

};

try {
  var response = UrlFetchApp.fetch(GEMINI_ENDPOINT, options);
  var data = JSON.parse(response.getContentText());

  Logger.log("Gemini API Response: " + JSON.stringify(data));

  // Extract the JSON part from the response
  if (data.candidates && data.candidates[0].content.parts[0].text) {
    var scriptText = data.candidates[0].content.parts[0].text;
    
    // Remove code block markers and parse JSON
    var startIndex = scriptText.indexOf('[');
    var endIndex = scriptText.lastIndexOf(']');
    var cleanScriptText = scriptText.substring(startIndex, endIndex + 1);
    var conversationScript = JSON.parse(cleanScriptText);

    Logger.log(conversationScript)

    // Cloud Run Call
    const url1 = 'https://us-central1-project2-283514.cloudfunctions.net/generateaudio';
    var payload1 = {
      'variable': JSON.stringify(conversationScript)
    };
    var options1 = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload1),
      'muteHttpExceptions': true
    };

    var cloudFunctionResponse = UrlFetchApp.fetch(url1, options1);
    Logger.log("Script sent to Cloud Run");
    Logger.log("Cloud Run Response: " + cloudFunctionResponse.getContentText());
  } else {
    Logger.log("Unexpected Gemini API response format: " + JSON.stringify(data));
  }
} catch (e) {
  Logger.log("Error during Gemini API or Cloud Run call: " + e.message);
}
}



