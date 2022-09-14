// This code is in Google Apps Script that gets the status codes of links specified in a Google Sheet.

function getStatus(url){
   var options = {
     'muteHttpExceptions': true,
     'followRedirects': false
   };
   var url_trimmed = url.trim();
   var response = UrlFetchApp.fetch(url_trimmed, options);
   return response.getResponseCode();
}
