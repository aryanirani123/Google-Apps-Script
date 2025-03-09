// Save in Apps Script Properties or Secret Manager

var CREDENTIALS = {
  private_key: "your_private_key"
  client_email: 'examplename@project2-283514.iam.gserviceaccount.com',
};

function getOAuthService(user) {
  return OAuth2.createService("Service Account")
    .setTokenUrl('https://oauth2.googleapis.com/token')
    .setPrivateKey(CREDENTIALS.private_key)
    .setIssuer(CREDENTIALS.client_email)
    .setSubject(user)
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setParam('access_type', 'offline')
    .setScope('https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/spreadsheets')
}

function reset() {
  var service = getOAuthService();
  service.reset();
}


// Function to execute BigQuery query
function executeQuery(query) {
  const service = getOAuthService(CREDENTIALS.client_email);
  if (!service.hasAccess()) {
    throw new Error('Authorization required. Check script permissions.');
  }

  const request = {
    query: query,
    useLegacySql: false
  };
  const projectId = 'project2-283514';
  return BigQuery.Jobs.query(request, projectId);
}

// Function to process and log results
function processQueryResults(queryResults, sheet, headers, startRow) {
  if (queryResults.rows && queryResults.rows.length > 0) {
    const data = queryResults.rows.map(row => row.f.map(cell => cell.v));
    const lastRow = sheet.getLastRow();

    // Clear previous data
    if (lastRow > startRow - 1) {
      sheet.getRange(startRow, 2, lastRow - startRow + 1, headers.length).clear();
    }

    // Write headers and data
    sheet.getRange(1, 2, 1, headers.length).setValues([headers]);
    sheet.getRange(startRow, 2, data.length, headers.length).setValues(data);
  } else {
    Logger.log('No data found.');
  }
}

// Fetch results for multiple IDs
function FetchResults() {
  const spreadsheetId = 'your_spreadsheet_id';
  const sheetName = 'your_sheet_name';
  const timestampCell = 'your_timestamp_cell';

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);
  const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat();

  if (ids.length === 0) {
    Logger.log('No IDs found in the sheet.');
    return;
  }
  // This is an example query you can always customise it to your needs.
  const query = `
    SELECT 
      \`Test Name\`, 
      \`Participants\`, 
      \`Test Focus\`
    FROM \`project2-283514.invoices_dataset.FInalTry\`
    WHERE \`id\` IN (${ids.map(id => `'${id}'`).join(", ")})
    ORDER BY \`Test Name\`;
  `;

  const queryResults = executeQuery(query);
  processQueryResults(queryResults, sheet, ['Test Name', 'Participants', 'Test Focus'], 2);
  sheet.getRange(timestampCell).setValue(`Last Updated: ${new Date()}`);
}
