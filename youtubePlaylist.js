function addvideos() {

const ss = SpreadsheetApp.getActiveSpreadsheet();

const sheet = ss.getActiveSheet();

const START_ROW = 2;

const START_COLUMN = 1;

const video_ID = sheet.getRange(START_ROW,START_COLUMN,sheet.getLastRow()).getValues().flat([1]);

const playlistId = "PL36VXnx9Wxva1nNai3erO1Hpzuu-2zwES";

video_ID.forEach( vid =>
       
       YouTube.PlaylistItems.insert({

snippet: {
     
     playlistId: playlistId,
     
     resourceId: {
         
         kind: "youtube#video",
         
         videoId: vid
        
         }
   }
}, "snippet"));
}
