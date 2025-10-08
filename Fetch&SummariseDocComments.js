const GEMINI_API_KEY = "your_api_key";

function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu('AI Comment Tools')
    .addItem('Summarize All Comments (Gemini)', 'summarizeDocComments')
    .addToUi();
}

/**
 * Fetch comments and their context from the Google Doc
 */
function listComments() {
  const documentId = DocumentApp.getActiveDocument().getId();
  const documentBodyText = DocumentApp.getActiveDocument().getBody().getText();
  const options = {
    fields: 'comments(id, content, createdTime, author(displayName), resolved, replies(id, content, createdTime, author(displayName)), anchor)'
  };

  let allCommentsAndContext = '';
  let commentCount = 0;

  try {
    const response = Drive.Comments.list(documentId, options);
    const comments = response.comments;

    if (!comments || comments.length === 0) {
      return { commentsString: '', count: 0 };
    }

    commentCount = comments.length;
    comments.forEach(comment => {
      const author = comment.author ? comment.author.displayName : 'Unknown Author';
      const commentContent = comment.content || '[No Content]';
      let contextualText = '';

      if (comment.anchor && comment.anchor.range) {
        const range = comment.anchor.range;
        const startIndex = range.startIndex || 0;
        const endIndex = range.endIndex || documentBodyText.length;
        contextualText = documentBodyText.substring(startIndex, endIndex).trim();
      }

      allCommentsAndContext += `--- Context for Comment by ${author} ---\n`;
      allCommentsAndContext += `${contextualText || '[No context found]'}\n`;
      allCommentsAndContext += `--- Comment: ---\n${commentContent}\n`;

      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => {
          const replyAuthor = reply.author ? reply.author.displayName : 'Unknown Author';
          const replyContent = reply.content || '[No Content]';
          allCommentsAndContext += `  ↳ Reply from ${replyAuthor}: ${replyContent}\n`;
        });
      }
      allCommentsAndContext += `------------------------\n\n`;
    });
  } catch (e) {
    Logger.log(`Error fetching comments: ${e.message}`);
    return { commentsString: '', count: 0 };
  }

  return { commentsString: allCommentsAndContext, count: commentCount };
}

/**
 * Generate a summary using Gemini API
 */
function generateSummary(commentsAndContext) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const promptText = `Summarize the following Google Docs comments (with context). Identify key feedback, action items, and recurring themes. Format as clear bullet points. Be concise and omit quotation marks.\n\n${commentsAndContext}`;

  const headers = { "Content-Type": "application/json" };
  const payload = JSON.stringify({
    contents: [{ parts: [{ text: promptText }] }]
  });

  const response = UrlFetchApp.fetch(endpoint, {
    method: "POST",
    headers: headers,
    payload: payload,
    muteHttpExceptions: true
  });

  const json = JSON.parse(response.getContentText());
  if (json.candidates && json.candidates.length > 0) {
    return json.candidates[0].content.parts[0].text.trim();
  } else if (json.error) {
    throw new Error(json.error.message);
  } else {
    throw new Error("Unexpected API response format.");
  }
}

/**
 * Insert a styled summary at the top of the Google Doc
 */
function insertStyledSummary(summary) {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();

  // Insert header
  const header = body.insertParagraph(0, "🧠 AI Comment Summary (Powered by Gemini AI)");
  header.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  // Insert timestamp
  const timestamp = new Date().toLocaleString();
  const timestampPara = body.insertParagraph(1, `Generated on: ${timestamp}`);
  timestampPara.setItalic(true);

  // Insert summary content
  const summaryPara = body.insertParagraph(2, summary);
  summaryPara.setSpacingAfter(12);
}

/**
 * Main function that runs the summarization
 */
function summarizeDocComments() {
  const ui = DocumentApp.getUi();

  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    ui.alert("API Key Missing", "Please add your Gemini API key at the top of the script.", ui.ButtonSet.OK);
    return;
  }

  ui.alert("Fetching all comments from your document...");
  const commentsData = listComments();

  if (!commentsData.count) {
    ui.alert("No Comments Found", "This document has no comments to summarize.", ui.ButtonSet.OK);
    return;
  }

  const confirmMessage = `Found ${commentsData.count} comments. Do you want to summarize them using Gemini AI?`;
  const userResponse = ui.alert("Confirm Summarization", confirmMessage, ui.ButtonSet.YES_NO);
  if (userResponse !== ui.Button.YES) {
    ui.alert("Action Cancelled", "Comment summarization was cancelled.", ui.ButtonSet.OK);
    return;
  }

  ui.alert("Processing...", "Sending comments to Gemini AI for summarization.", ui.ButtonSet.OK);

  let summary;
  try {
    summary = generateSummary(commentsData.commentsString);
  } catch (e) {
    ui.alert("Gemini API Error", `An error occurred: ${e.message}`, ui.ButtonSet.OK);
    return;
  }

  insertStyledSummary(summary);
  ui.alert("✅ Summary Inserted", "Your AI summary has been added to the top of the document.", ui.ButtonSet.OK);
}
