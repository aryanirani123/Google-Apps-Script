// This is the code for the Google AppSheet Training
// This is code is used in the automation tab in Google AppSheet

function main(body) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Inventory");

  const START_COLUMN = 1
  const START_ROW = 2

  const data = sheet.getRange(START_ROW,START_COLUMN,sheet.getLastRow()-1,6).getValues();

  //Logger.log(data)

  data.forEach(function(row,i){

    const product_name = row[1];
    //Logger.log(product_name)

    const category = row[2];
    //Logger.log(category)

    const stock = row[4];
    //Logger.log(stock)

    EmailBody(product_name,category,stock)

  });

  const target_email = Session.getActiveUser().getEmail()
  const email_Subject = "New product added to Inventory";
  MailApp.sendEmail(target_email,email_Subject,"",{htmlBody: body})
  
}

function EmailBody(product_name,category,stock){

  const body = "Details of new product added" +  "<br><br>" +
               "Product Name" + product_name +  "<br><br>" +
               "Category of Product" + category +  "<br><br>" +
               "Initial Stock" + stock + +  "<br><br>";


  return body



}
