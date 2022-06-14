// This is the code for the Google AppSheet Training
// This is code is used in the automation tab in Google AppSheet


function main(Product,Category,InitialStock) {


  const sheet_ID = "1rLgHO-ECR8_mxJTnGjSM5hBOT1PgPY86EeHS6Ypb_Xs"


  const ss = SpreadsheetApp.openById(sheet_ID)
  const sheet = ss.getSheetByName("Inventory")

  const START_COLUMN = 1
  const START_ROW = 2

  const body = "Details of new product added" +  "<br><br>" +
               "Product Name        : " + Product +  "<br><br>" +
               "Category of Product : " + Category +  "<br><br>" +
               "Initial Stock       : " + InitialStock +  "<br><br>";

  const target_email = Session.getActiveUser().getEmail()
  const email_Subject = "New product added to Inventory";
  MailApp.sendEmail(target_email,email_Subject,"",{htmlBody: body})
  
}
