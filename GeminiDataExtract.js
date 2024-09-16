function processPdfToSheet() {
  var archiveFolderId = "YOUR_ARCHIVE_FOLDER_ID";
  const folderId1 = "YOUR_FOLDER_ID";
  var folder = DriveApp.getFolderById(folderId1);
  var files = folder.getFiles();

  while (files.hasNext()) {
    var file = files.next();
    if (file.getMimeType() === MimeType.PDF) { // Filter PDF files
      var fileId = file.getId();
      var pdfContent = convertPdfToGoogleDoc(fileId, folder);
      var responseData = sendToGemini(pdfContent);
      var details = extractFields(responseData);

      // Update Google Sheet with extracted details
      updateSheet(details);

      // Move the original PDF and the converted Google Doc to the archive folder
      var archiveFolder = DriveApp.getFolderById(archiveFolderId);
      moveFileToArchive(file, archiveFolder);
    }
  }
}


function convertPdfToGoogleDoc(fileId, folder) {
  var file = DriveApp.getFileById(fileId);
  var blob = file.getBlob();
  var newFileName = file.getName().replace(/\.pdf$/, '') + ' converted';
  var resource = {
    title: newFileName,
    mimeType: MimeType.GOOGLE_DOCS
  };
  var options = {
    ocr: true,
    ocrLanguage: 'en'
  };
  var convertedFile = Drive.Files.create(resource, blob, options);
  var doc = DocumentApp.openById(convertedFile.id);
  var pdfContent = doc.getBody().getText();
  var convertedFileObj = DriveApp.getFileById(convertedFile.id);
  convertedFileObj.setTrashed(true); // Move to trash
  return pdfContent;
}

function sendToGemini(pdfData) {
  const GEMINI_KEY = 'YOUR_API_KEY';
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`;
  var headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  var requestBody = {
    "contents": [
      {
        "parts": [
          {
            "text": `extract the following details: Vendor Name: Invoice Number: Amount Due: Due Date: Description Tax: \n${pdfData}`
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
  try {
    var response = UrlFetchApp.fetch(GEMINI_ENDPOINT, options);
    var datanew = JSON.parse(response.getContentText());
    return datanew;
  } catch (error) {
    Logger.log('Error calling Gemini API: ' + error);
    return null;
  }
}

function extractFields(datanew) {
  if (!datanew || !datanew.candidates || !datanew.candidates.length) {
    Logger.log('No valid data returned from Gemini.');
    return {};
  }
  
  var textContent = datanew.candidates[0].content.parts[0].text;
  textContent = textContent.replace(/- /g, '').trim();
  var lines = textContent.split('\n');

  var details = {};
  lines.forEach(function (line) {
    var parts = line.split(':');
    if (parts.length === 2) {
      var key = parts[0].replace(/\*\*/g, '').trim();
      var value = parts[1].replace(/\*\*/g, '').trim();
      details[key] = value;
    }
  });

  return details;
}

function updateSheet(details) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Invoices");
  var range = sheet.getDataRange();
  var values = range.getValues();

  var vendorName = details['Vendor Name'];
  var nameFound = false;

  var currentDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yy');
  var formattedDateTime = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

  for (var i = 1; i < values.length; i++) {
    if (values[i][2].toLowerCase() === vendorName.toLowerCase()) { // Compare by Vendor Name
      nameFound = true;
      sheet.getRange(i + 1, 1).setValue(details['Invoice Number']); // Column A
      sheet.getRange(i + 1, 6).setValue(details['Amount Due']); // Column F
      sheet.getRange(i + 1, 7).setValue(details['Due Date']); // Column G
      sheet.getRange(i + 1, 9).setValue("Last updated at: " + formattedDateTime); // Column I
      Logger.log("Updated Row " + (i + 1));
      break;
    }
  }

  if (!nameFound) {
    Logger.log("Vendor not found: " + vendorName);
    var newRow = values.length + 1;

    sheet.getRange(newRow, 1).setValue(details['Invoice Number']); // Column A
    sheet.getRange(newRow, 3).setValue(vendorName); // Column C
    sheet.getRange(newRow, 4).setValue(details['Description']); // Column D
    sheet.getRange(newRow, 5).setValue(vendorName); // Column E
    sheet.getRange(newRow, 6).setValue(details['Amount Due']); // Column F
    sheet.getRange(newRow, 7).setValue(details['Due Date']); // Column G
    sheet.getRange(i + 1, 9).setValue("Last updated at: " + formattedDateTime); // Column I
    Logger.log("New Row Added");
  }
}

function moveFileToArchive(file, archiveFolder) {
  file.moveTo(archiveFolder);
}
