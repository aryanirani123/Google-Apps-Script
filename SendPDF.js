// This code is written in Google Apps Script(JavaScript)
// This code sends out automated pdfs on email to the people who have registered for the Event.
// The Google Sheet contains details on each of the student for whom we have to create ID cards
// On running the code the ID cards will automatically get created and send it to the email address of the student.



function After_Submit(e){
  
  const info = e.namedValues;
  const pdfFile = Create_PDF(info);  
  
  console.log(info);
  
  sendEmail(e.namedValues['Email Address'][0],pdfFile);  
}

function sendEmail(email,pdfFile){
  
  GmailApp.sendEmail(email, "ID CARD", "This is your ID Card.", {
    attachments: [pdfFile], 
    name: "HEllO"

  });
 
}
function Create_PDF(info) {
  
  const PDF_folder = DriveApp.getFolderById("1zx7rnI2M3p2U7RGTJugM_0G5aMINYTyh");
  const TEMP_FOLDER = DriveApp.getFolderById("1jO1BHwhwkKbGFcyT8DAJsew2v0gjCI4W");
  const PDF_Template = DriveApp.getFileById("1qHOMwuq2X_5LhUCfPLWcpUSh2n7pVRvHZ_kE-hsGmwg");
  
  const newTempFile = PDF_Template.makeCopy(TEMP_FOLDER);
  const  OpenDoc = DocumentApp.openById(newTempFile.getId());
  const body = OpenDoc.getBody();
  
  console.log(body);
  
   body.replaceText("{email}", info['Email Address'][0])
   body.replaceText("{name}", info['Enter your name'][0]);
   body.replaceText("{roll}", info['Enter your Roll number'][0]);
   body.replaceText("{number}", info['Enter your phone number '][0]);
   body.replaceText("{DOB}", info['Enter you Date of Birth '][0]);
   body.replaceText("{BLOOD}", info['Enter your Blood Group  [Eg:  O negative]'][0]);

  OpenDoc.saveAndClose();
  

  const BLOBPDF = newTempFile.getAs(MimeType.PDF);
  const pdfFile =  PDF_folder.createFile(BLOBPDF).setName(info['Enter your name'][0] + " " + info['Enter your Roll number'][0]);
  console.log("The file has been created ");
  
  return pdfFile;

}
