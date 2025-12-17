function analyzeAndApplyDynamicLabel66556() {
  const fileID = "your_file_id";
  const driveFileID = 'your_file_id';
  const apiKey = "your_api_key"; // Replace with your actual API key
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
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const labelSuggestionPrompt = `Analyze the document and suggest an appropriate label. Just return the label. Available labels are: ${Object.keys(labelMap).join(", ")}.\nDocument:\n${documentContent}`;
    const labelResponse = makeGeminiApiRequest(apiUrl, labelSuggestionPrompt);
    if (!labelResponse) return;
    const suggestedLabel = labelResponse.candidates[0].content.parts[0].text.trim();
    Logger.log(`Suggested Label: ${suggestedLabel}`);
    // Step 4: Apply the label and populate fields
    if (labelMap[suggestedLabel]) {
      const labelData = labelMap[suggestedLabel];
      const labelId = labelData.id;
      if (labelData.fields && labelData.fields.length > 0) {
        const fieldPrompt = generateFieldPrompt(labelData.fields, documentContent);
        const fieldResponse = makeGeminiApiRequest(apiUrl, fieldPrompt);
        if (fieldResponse) {
          const fieldValues = parseFieldData(fieldResponse.candidates[0].content.parts[0].text.trim());
          applyLabelAndPopulateFields(driveFileID, labelId, labelData.fields, fieldValues);
        } else {
          Logger.log('Failed to fetch field data for label.');
        }
      } else {
        // Apply label without fields
        const addLabelRequest = Drive.newModifyLabelsRequest()
          .setLabelModifications([Drive.newLabelModification().setLabelId(labelId)]);
        const addLabelResponse = Drive.Files.modifyLabels(addLabelRequest, driveFileID);
        Logger.log(`Labels applied: ${JSON.stringify(addLabelResponse.modifiedLabels)}`);
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
  return `Analyze the document and return ONLY a JSON object with the following keys: ${fieldNames}.
  No markdown. No additional text. Just valid JSON.
Document Content:
${documentContent}`;
}

function parseFieldData(fieldData) {
  try {
    // Strip common markdown code blocks (e.g., ```json ... ```)
    let cleanData = fieldData
      .replace(/```json\s*/g, '')  // Remove ```json
      .replace(/```\s*/g, '')      // Remove ```
      .replace(/^\s*[\n\r]+|[\n\r]+\s*$/g, '')  // Trim leading/trailing newlines
      .trim();
    
    // Fallback: If still invalid, try to extract JSON substring (between { and })
    if (!cleanData.startsWith('{') || !cleanData.endsWith('}')) {
      const jsonMatch = cleanData.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
      if (jsonMatch) {
        cleanData = jsonMatch[0];
      } else {
        throw new Error('No valid JSON object found');
      }
    }
    
    const fieldValues = JSON.parse(cleanData);
    Logger.log(`Parsed field values: ${JSON.stringify(fieldValues)}`);
    return fieldValues;
  } catch (e) {
    Logger.log(`Error parsing JSON field data: ${e.message}. Raw data: ${fieldData}`);
    return {};
  }
}

function applyLabelAndPopulateFields(fileId, labelId, fields, fieldValues) {
  try {
    // Build field modifications as plain objects based on type
    const fieldModifications = fields.map(field => {
      const displayName = field.properties.displayName;
      const fieldValue = fieldValues[displayName];
      if (!fieldValue) {
        Logger.log(`No value for field: ${displayName}`);
        return null;
      }

      let fieldMod = {
        kind: "drive#labelFieldModification",
        fieldId: field.id
      };

      if (field.selectionOptions) {
        const choice = field.selectionOptions.choices.find(choice =>
          choice.properties.displayName.toLowerCase() === fieldValue.toLowerCase()
        );
        if (choice) {
          fieldMod.setSelectionValues = [choice.id];
        } else {
          Logger.log(`No matching choice for ${displayName}: ${fieldValue}`);
          return null;
        }
      } else if (field.integerOptions) {
        const intValue = parseInt(fieldValue);
        if (!isNaN(intValue)) {
          fieldMod.setIntegerValues = [intValue.toString()];
        } else {
          Logger.log(`Invalid integer for ${displayName}: ${fieldValue}`);
          return null;
        }
      } else if (field.dateOptions) {
        // Parse to ISO "2025-11-28"
        const date = new Date(fieldValue);
        if (!isNaN(date.getTime())) {
          const isoDate = date.toISOString().split('T')[0];
          fieldMod.setDateValues = [isoDate];
        } else {
          Logger.log(`Invalid date for ${displayName}: ${fieldValue}`);
          return null;
        }
      } else if (field.textOptions) {
        fieldMod.setTextValues = [fieldValue];
      } else {
        Logger.log(`Unknown field type for ${displayName}`);
        return null;
      }

      return fieldMod;
    }).filter(mod => mod !== null);

    if (fieldModifications.length === 0) {
      Logger.log('No valid modifications for fields.');
      return;
    }

    // Build request as plain object (applies label + fields atomically)
    const request = {
      kind: "drive#modifyLabelsRequest",
      labelModifications: [
        {
          kind: "drive#labelModification",
          labelId: labelId,
          fieldModifications: fieldModifications,
          removeLabel: false  // Ensure label is kept/applied
        }
      ]
    };
    Logger.log(`Request body: ${JSON.stringify(request)}`);

    const response = Drive.Files.modifyLabels(request, fileId);
    Logger.log(`Label and fields applied: ${JSON.stringify(response.modifiedLabels)}`);
  } catch (error) {
    Logger.log(`Error while applying label and populating fields: ${error.message}`);
  }
}
