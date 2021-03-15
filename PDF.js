function CreateBulkPDF(PDFContentBlob){

// Getting all the Files to store the PDF's
  const docfile = DriveApp.getFileById("1UCwUYnp94yYwQp8ZK30ks3UtRX3id5cX5wz97E55CRQ");
  const TempFolder = DriveApp.getFolderById("1N0ayWXIEU1oHmhg02wx7FkBNliEturZV");
  const PDFFolder = DriveApp.getFolderById("1NJlToP7fsLIO4T9NpXC4FmJY4S-SMHMR");

  const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("marks");
  var data = ss.getRange(4,1, ss.getLastRow() -3,19).getValues();
  //Logger.log(data);

// Getting the Name of the Subjects 
  var sub1 = ss.getRange("E3").getValue(); // Subject 1
  //console.log(sub1);

  var sub2 = ss.getRange("G3").getValue(); // Subject 3 
  //console.log(sub3);

  var sub3 = ss.getRange("I3").getValue(); // Subject 2
  //console.log(sub5);

  var sub4 = ss.getRange("K3").getValue(); // Subject 1
  //console.log(sub7);

  var sub5 = ss.getRange("M3").getValue(); // Subject 3 
  //console.log(sub9);

  var sub6 = ss.getRange("O3").getValue(); // Subject 3 
  //console.log(sub11);
// Getting all the Details of the Students using ForEach 

   data.forEach(function(row,i){

    var SapId = row[1]; // Sap Id of the student
    //console.log(sap);

    var rollnum = row[2]; // Roll number of the student. 
   // console.log(roll);

    var name = row[3]; // Name of the student
   // console.log(name);

    var SOM1 = row[4];
   // console.log(SOM1); // Marks Strength of materials test1

    var SOM2 = row[5];
   // console.log(SOM2); // Marks of Strength of materials test2

    var Surv1  = row[6];
   // console.log(Surveying1); // Marks of Surveying Test1

    var Surv2 = row[7];
   // console.log(Surveying2) // Marks of Surveying Test2

   var Geo1 = row[8];
   //console.log(Eng_Geo1); // Marks of Engineering Geology Test1

   var Geo2 = row[9];
   // console.log(Eng_Geo2); // Marks of Engineering Geology Test2

   var Math1 = row[10];
   //console.log(Eng_Maths1); // Marks of Engineering Maths Test 1 

   var Math2 = row[11];
   //console.log(Eng_Maths2); // Marks of Engineering Maths Test 2 

   var Phy1 = row[12];
   // console.log(Eng_Phy1);  // Marks of Engineering Physics Test 1

   var Phy2 = row[13];
   // console.log(Eng_Phy2); // Marks of Engineering Physics Test 2

   var Num1 = row[14];
   // console.log(Num_Tech1); // Marks of Numerical Techniques Test 1

   var Num2 = row[15];
   // console.log(NumTech2); // Marks of Numerical Techniques Test 2
   var email = row[18];
   // console.log(email); // Email of the Parent 

  var pdfName = name+" " + rollnum;


   createPDF(name,rollnum,SapId,SOM1,SOM2,Surv1,Surv2,Geo1, Geo2,Math1,Math2,Phy1,Phy2,Num1,Num2,sub1,sub2,sub3,sub4,sub5,sub6,email,docfile,TempFolder,PDFFolder,pdfName);
  
   });

}




// Function that creates the PDF
function createPDF(name,rollnum,SapId,SOM1,SOM2,Surv1,Surv2,Geo1, Geo2,Math1,Math2,Phy1,Phy2,Num1,Num2,sub1,sub2,sub3,sub4,sub5,sub6,email, docfile,TempFolder,PDFFolder,pdfName){
// Getting all the Files like Docs, Temp Folder , Pdf Folder

  const tempFile = docfile.makeCopy(TempFolder);
  const TempDocFile = DocumentApp.openById(tempFile.getId());
  const body = TempDocFile.getBody();

// Searching and replacing the text into the Doc 
  TempDocFile.getBody().replaceText("{name}", name); // Name of the Student 
  TempDocFile.getBody().replaceText("{roll}", rollnum); // Roll Number of the Student 
  TempDocFile.getBody().replaceText("{sap}", SapId); // Sap ID of the Student 
  TempDocFile.getBody().replaceText("{som1}", SOM1); // Strength of Materials M1
  TempDocFile.getBody().replaceText("{som2}", SOM2); // Strength of Materials M2 
  TempDocFile.getBody().replaceText("{surv1}", Surv1); // Surveying M1 
  TempDocFile.getBody().replaceText("{surv2}", Surv2); // Surveying M2
  TempDocFile.getBody().replaceText("{geo1}", Geo1); // Engineering Geology M1
  TempDocFile.getBody().replaceText("{geo2}", Geo2); // Engineering Geology M2
  TempDocFile.getBody().replaceText("{maths1}", Math1); // Engineering Mathematics M1
  TempDocFile.getBody().replaceText("{maths2}", Math2); // Engineering Mathematics M2 
  TempDocFile.getBody().replaceText("{phy1}", Phy1); // Engineering Physics M1 
  TempDocFile.getBody().replaceText("{phy2}", Phy2); // Engineering Physics M2
  TempDocFile.getBody().replaceText("{num1}", Num1); // Numerical Techniques M1
  TempDocFile.getBody().replaceText("{num2}", Num2); // Numerical Techniques M2

  TempDocFile.getBody().replaceText("{Som}", sub1); // Strength of Materials
  TempDocFile.getBody().replaceText("{Surv}", sub2 ); // Surveying
  TempDocFile.getBody().replaceText("{geo}", sub3); // Engineering Geology
  TempDocFile.getBody().replaceText("{maths}", sub4); // Engineering Mathematics
  TempDocFile.getBody().replaceText("{phy}", sub5); // Engineering Physics
  TempDocFile.getBody().replaceText("{num}", sub6); // Numerical Techniques

  var pdfName = name+" " + rollnum;

// Saving all the changes made in the doc 
  TempDocFile.saveAndClose();
  const PDFContentBlob = tempFile.getAs(MimeType.PDF);
  const PDF_File =  PDFFolder.createFile(PDFContentBlob).setName(pdfName);
  TempFolder.removeFile(tempFile);

  MailApp.sendEmail(email,name + " " + rollnum,"These are your marks for M1 and M2",{

    attachments: [PDF_File.getAs(MimeType.PDF)]

   });


}
