// This code is written in Google Apps Script(JavaScript)
// This codes limit responses in Google Forms 
// As soon as the form responses reaches the limit, it closes the Google Form

function Limit_Responses() {

  max_responses = 5;// Maximum number of responses you want 
  var form = FormApp.openById("Your Form ID ");// Get the form by ID 
  var responses = form.getResponses();// Get the responses 
  len = responses.length;// Get the length of the responses 
  //Logger.log(len);
  if (len == max_responses){
    form.setAcceptingResponses(false); // Close the form and stop the responses

  }

}
