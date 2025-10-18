/**
 * Adds a custom menu in Google Docs to run the AI Audit directly.
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('AI Audit Tools')
    .addItem('Run AI Audit', 'runAuditAndInsert')
    .addToUi();
}

/**
 * Returns the entire text content of the document.
 */
function getDocumentText() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  let text = body.getText();
  return text.trim();
}

/**
 * Runs the AI Audit and inserts the result as text at the end of the document.
 */
function runAuditAndInsert() {
  const docText = getDocumentText();
  const result = runAudit(docText);
  
  if (result) {
    const doc = DocumentApp.getActiveDocument();
    const body = doc.getBody();
    // Append the audit result as a new paragraph at the end of the document
    body.appendParagraph('AI Audit Result: ' + result);
  }
}

/**
 * Runs the AI Audit using ADK Agent and Gemini formatting.
 */
function runAudit(docText) {
  console.log('[INFO] Starting AI audit process...');
  if (!docText) {
    console.log('[WARN] No text in document.');
    return '⚠️ The document is empty. Please add some text to audit.';
  }

  // Check for excessive document length to avoid token limits
  if (docText.length > 10000) {
    console.log('[WARN] Document too long.');
    return '⚠️ Document exceeds 10,000 characters. Please shorten the text.';
  }

  console.log('[STEP] Sending text to ADK Agent...');
  const rawAudit = requestLlmAuditorAdkAiAgent(docText);

  // Check if rawAudit is an error message
  if (rawAudit.startsWith('ERROR:')) {
    console.error('[ERROR] ADK Agent returned error:', rawAudit);
    return rawAudit;
  }

  console.log('[STEP] Formatting AI response...');
  let formatted;
  try {
    formatted = requestOutputFormatting(
      `Here is a fact-checking result: ${rawAudit}.
       Summarize it. Keep the main verdict and reasoning. Remove markdown and make it concise.`
    );
  } catch (error) {
    console.error('[ERROR] Formatting failed:', error.toString());
    return `ERROR: Failed to format audit result - ${error.toString()}`;
  }

  console.log('[SUCCESS] Audit completed successfully.');
  console.log('[RESULT] Final Output:', formatted);
  return formatted;
}
