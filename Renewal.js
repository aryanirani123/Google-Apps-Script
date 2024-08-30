function checkAndSendRenewalEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();

  // Assuming 'Subscription End Date' is in column 6 (F), 'Name' is in column 2 (B), and 'User ID' is in column 0 (A)
  const EmailRange = sheet.getRange(3, 2, sheet.getLastRow() - 2, 1);
  const EndDateRange = sheet.getRange(3, 7, sheet.getLastRow() - 2, 1);
  const NameRange = sheet.getRange(3, 3, sheet.getLastRow() - 2, 1);
  const StatusRange = sheet.getRange(3, 10, sheet.getLastRow() - 2, 1); // Assuming we add 'Status' column
  const LogsRange = sheet.getRange(3, 11, sheet.getLastRow() - 2, 1);   // Assuming we add 'Logs' column

  const EmailValues = EmailRange.getValues();
  const EndDateValues = EndDateRange.getValues();
  const NameValues = NameRange.getValues();
  const StatusValues = StatusRange.getValues();
  const LogsValues = LogsRange.getValues();

  const today = new Date();
  const currentmonth = today.getMonth();
  const currentyear = today.getFullYear();
  const dayOfMonth = today.getDate();

  if (dayOfMonth !== 30) { // Adjust this check as per your requirement
    Logger.log("Today is not the 6th of the month. No emails will be sent.");
    return;
  }

  Logger.log(`Today's date is ${today}`);
  Logger.log(`Processing ${EmailValues.length} rows`);

  for (let i = 0; i < EmailValues.length; i++) {
    const email = EmailValues[i][0];
    const endDateStr = EndDateValues[i][0];
    const name = NameValues[i][0];

    Logger.log(`Row ${i + 3}: email=${email}, endDateStr=${endDateStr}`);

    if (email !== "" && endDateStr !== "") {
      const endDate = new Date(endDateStr);
      if (isNaN(endDate)) {
        Logger.log(`Invalid date in row ${i + 3}: ${endDateStr}`);
        LogsValues[i][0] = `Invalid date format: ${endDateStr}`;
        continue;
      }

      const monthend = endDate.getMonth();
      const dayend = endDate.getDate();

      Logger.log(`Row ${i + 3}: endDate=${endDate}, monthend=${monthend}, dayend=${dayend}, name=${name}`);

      if (monthend === currentmonth && endDate.getFullYear() === currentyear) {
        try {
          const emailBody = `
Dear ${name},

We hope you're enjoying your fitness journey with us! We wanted to remind you that your gym membership is set to expire on ${endDateStr}.

To keep your momentum going and continue achieving your fitness goals, we encourage you to renew your membership before it expires. By renewing now, you'll ensure that you have uninterrupted access to all our facilities, classes, and expert trainers.

If you have any questions about your renewal options or need assistance, our team is here to help. Just give us a call or drop by the front desk on your next visit.

Thank you for being a valued member of our fitness community. We look forward to supporting you in your ongoing pursuit of health and wellness.

Stay strong,

24/7 Fitness
Member Support Team
Rachel Grae

P.S. Renew your membership this month and enjoy exclusive offers, including discounted personal training sessions!
`;

          MailApp.sendEmail(email, "Please upgrade your subscription", emailBody);
          Logger.log(`Email sent to ${email} for renewal date ${endDateStr}`);
          StatusValues[i][0] = 'Pending';
          LogsValues[i][0] = 'EMAIL SENT';
        } catch (e) {
          Logger.log(`Failed to send email to ${email}: ${e.message}`);
          LogsValues[i][0] = `Failed to send email: ${e.message}`;
        }
      }
    } else {
      Logger.log(`Skipping row ${i + 3} due to missing email or end date.`);
      LogsValues[i][0] = 'Missing email or end date';
    }
  }

  // Update the Status and Logs columns
  StatusRange.setValues(StatusValues);
  LogsRange.setValues(LogsValues);
}
