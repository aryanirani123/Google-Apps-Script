// This code is written in Google Apps Script(JavaScript)
// This code sends out charts from Google Sheets 
// Charts are created in Google Sheets,using Google Apps Script the charts will be emailed to the specified email.

function emailChartSourceImage(){
  const sheet = SpreadsheetApp.getActiveSheet(); 
  const charts = sheet.getCharts(); 
  
  // setup some variables for our email
  const chartBlobs = new Array(); 
  const emailImages = {};
  let emailBody = "Charts<br>"; 
  
  charts.forEach(function(chart, i){
    chartBlobs[i] = chart.getAs("image/png");
    emailBody += "<p align='center'><img src='cid:chart"+i+"'></p>"; // Alligning the chart to the center of the body in the email
    emailImages["chart"+i] = chartBlobs[i];
  });
  
  MailApp.sendEmail({
    to: "aryanirani123@gmail.com",
    subject: "Chart for average marks per subject",
    htmlBody: emailBody,
    inlineImages:emailImages}); 
}
