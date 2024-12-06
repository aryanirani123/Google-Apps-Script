function analyzeAndApplyDynamicLabel66556() {
  const fileID = "1hK8E-7z-XgpvtWJ7MTxz7d4giGZULjAjG6VssDMPHrs";
  const driveFileID = '1hK8E-7z-XgpvtWJ7MTxz7d4giGZULjAjG6VssDMPHrs';
  const apiKey = "AIzaSyDHWFWH9IVgnUGftBown8OBJiRwL-rLOx8"; // Replace with your actual API key

  try {
    // Step 1: Fetch labels dynamically
    const labelsResponse = DriveLabels.Labels.list({ view: "LABEL_VIEW_FULL" });
    const labels = labelsResponse.labels;
    if (!labels || labels.length === 0) {
      Logger.log("No labels found.");
      return;
    }

    const labelMap = {};
    labels.forEach(label => {
      if (label.properties?.title) {
        labelMap[label.properties.title] = {
          id: label.id,
          fields: label.fields
        };
      }
    });
    Logger.log(`Available Labels: ${JSON.stringify(labelMap)}`);

    // Step 2: Get document content
    const doc = DocumentApp.openById(fileID);
    const documentContent = doc.getBody().getText();
    Logger.log(`Document Content: ${documentContent}`);

    // Step 3: Gemini API call for label suggestion
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const labelSuggestionPrompt = `Analyze the document and suggest an appropriate label. Just return the label. Available labels are: ${Object.keys(labelMap).join(", ")}.\nDocument:\n${documentContent}`;

    const labelResponse = makeGeminiApiRequest(apiUrl, labelSuggestionPrompt);
    if (!labelResponse) return;

    const suggestedLabel = labelResponse.candidates[0].content.parts[0].text.trim();
    Logger.log(`Suggested Label: ${suggestedLabel}`);

    // Step 4: Apply the label and populate fields
    if (labelMap[suggestedLabel]) {
      const labelData = labelMap[suggestedLabel];
      const labelId = labelData.id;

      const addLabelRequest = Drive.newModifyLabelsRequest()
        .setLabelModifications([Drive.newLabelModification().setLabelId(labelId)]);
      const addLabelResponse = Drive.Files.modifyLabels(addLabelRequest, driveFileID);
      Logger.log(`Labels applied: ${JSON.stringify(addLabelResponse.modifiedLabels)}`);

      if (labelData.fields && labelData.fields.length > 0) {
        const fieldPrompt = generateFieldPrompt(labelData.fields, documentContent);
        const fieldResponse = makeGeminiApiRequest(apiUrl, fieldPrompt);

        if (fieldResponse) {
          const fieldValues = parseFieldData(fieldResponse.candidates[0].content.parts[0].text.trim());
          applyLabelAndPopulateFields(driveFileID, labelId, labelData.fields, fieldValues);
        } else {
          Logger.log('Failed to fetch field data for label.');
        }
      }
    } else {
      Logger.log(`Suggested label "${suggestedLabel}" not found among available labels.`);
    }
  } catch (error) {
    Logger.log(`Failed to analyze and apply label: ${error.message}`);
  }
}

function makeGeminiApiRequest(apiUrl, prompt) {
  const requestBody = { contents: [{ parts: [{ text: prompt }] }] };
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  Logger.log(`Gemini API Response Code: ${responseCode}`);
  Logger.log(`Gemini API Response Text: ${responseText}`);

  if (responseCode !== 200) {
    Logger.log(`Error calling Gemini API: ${responseText}`);
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch (e) {
    Logger.log(`Error parsing Gemini API response: ${e.message}`);
    return null;
  }
}

function generateFieldPrompt(fields, documentContent) {
  const fieldNames = fields.map(field => field.properties.displayName).join(", ");
  return `Analyze the document and extract the following details: ${fieldNames}. Document Content:\n${documentContent}`;
}

function parseFieldData(fieldData) {
  const fieldValues = {};
  const lines = fieldData.split('\n');

  lines.forEach(line => {
    const [key, value] = line.split(':').map(part => part.trim());
    if (key && value) {
      fieldValues[key] = value;
    }
  });

  Logger.log(`Parsed field values: ${JSON.stringify(fieldValues)}`);
  return fieldValues;
}

function applyLabelAndPopulateFields(fileId, labelId, fields, fieldValues) {
  try {
    // Step 1: Apply the label
    const labelModification = Drive.newLabelModification().setLabelId(labelId);
    const applyLabelRequest = Drive.newModifyLabelsRequest().setLabelModifications([labelModification]);

    const applyLabelResponse = Drive.Files.modifyLabels(applyLabelRequest, fileId);
    Logger.log(`Label applied successfully: ${JSON.stringify(applyLabelResponse.modifiedLabels)}`);

    // Step 2: Populate label fields
    const labelModifications = fields.map(field => {
      const fieldValue = fieldValues[field.properties.displayName];

      if (field.selectionOptions) {
        const choice = field.selectionOptions.choices.find(choice =>
          choice.properties.displayName.toLowerCase() === fieldValue.toLowerCase()
        );
        if (choice) {
          return Drive.newFieldModification()
            .setFieldId(field.id)
            .setChoiceId(choice.id);
        }
      } else if (fieldValue) {
        return Drive.newFieldModification()
          .setFieldId(field.id)
          .setText(fieldValue);
      }

      Logger.log(`No valid value for field: ${field.properties.displayName}`);
      return null;
    }).filter(mod => mod !== null);

    if (labelModifications.length === 0) {
      Logger.log('No valid modifications for fields.');
      return;
    }

    // Send modifications in a single request
    const populateFieldsRequest = Drive.newModifyLabelsRequest()
      .setLabelModifications([
        Drive.newLabelModification()
          .setLabelId(labelId)
          .setFieldModifications(labelModifications)
      ]);

    const populateFieldsResponse = Drive.Files.modifyLabels(populateFieldsRequest, fileId);
    Logger.log(`Fields populated successfully: ${JSON.stringify(populateFieldsResponse.modifiedLabels)}`);

  } catch (error) {
    Logger.log(`Error while applying label and populating fields: ${error.message}`);
  }
}
