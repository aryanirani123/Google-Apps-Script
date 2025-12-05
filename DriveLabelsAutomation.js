/**
 * Tutorial: Complete Google Drive Labels Automation in Apps Script
 * 
 * Copy-paste this entire code into a new Google Apps Script project (script.google.com).
 * Prerequisites:
 * 1. Enable Drive API v3 and Drive Labels API v2 (Editor > Services > + > Search/Add each).
 * 2. Re-authorize permissions (Run > Review permissions).
 * 3. Replace fileId in fullLabelAutomation() with your actual file ID.
 * 4. Ensure "Invoice" label exists and is published in Google Workspace Admin > Drive > Labels.
 * 
 * 
 * This script:
 * - Fetches available labels.
 * - Mocks suggestion as "Invoice" (replace with Gemini for dynamic).
 * - Fetches fields for the label.
 * - Applies label + populates fields with mock values (from your invoice example).
 * - Logs everything; check file in Drive > Details > Labels for results.
 */

// 1. Fetch Currently Available Labels and Their IDs
function fetchAvailableLabels() {
  try {
    const response = DriveLabels.Labels.list({ view: "LABEL_VIEW_FULL" });
    const labels = response.labels || [];
    if (labels.length === 0) {
      Logger.log("No labels found. Check Workspace admin for published labels.");
      return {};
    }

    const labelMap = {};
    labels.forEach(label => {
      if (label.properties?.title) {
        labelMap[label.properties.title] = label.id;
      }
    });

    Logger.log(`Fetched ${labels.length} labels: ${JSON.stringify(labelMap)}`);
    return labelMap;
  } catch (error) {
    Logger.log(`Error fetching labels: ${error.message}`);
    return {};
  }
}

// 2. Fetch Label Fields and Their IDs (list-based to avoid 404)
function fetchLabelFields(labelId) {
  try {
    if (!labelId) {
      throw new Error("labelId is required. Run fetchAvailableLabels() first and copy an ID.");
    }

    const response = DriveLabels.Labels.list({ view: "LABEL_VIEW_FULL" });
    const labels = response.labels || [];
    if (labels.length === 0) {
      Logger.log("No labels found. Check Workspace admin for published labels.");
      return {};
    }

    const targetLabel = labels.find(label => label.id === labelId);
    if (!targetLabel) {
      Logger.log(`Label ID "${labelId}" not found in available labels. Run fetchAvailableLabels() to verify.`);
      return {};
    }

    const fields = targetLabel.fields || [];
    if (fields.length === 0) {
      Logger.log(`No fields found for label ${labelId}.`);
      return {};
    }

    const fieldMap = {};
    fields.forEach(field => {
      const displayName = field.properties?.displayName;
      if (displayName) {
        let type = 'text'; // Default
        if (field.integerOptions) type = 'integer';
        else if (field.dateOptions) type = 'date';
        else if (field.selectionOptions) type = 'selection';

        fieldMap[displayName] = {
          id: field.id,
          type: type
        };
      }
    });

    Logger.log(`Fetched ${fields.length} fields for label ${labelId}: ${JSON.stringify(fieldMap)}`);
    return fieldMap;
  } catch (error) {
    Logger.log(`Error fetching fields for label ${labelId}: ${error.message}`);
    return {};
  }
}

// 3. Apply Label to File
function applyLabelToFile(fileId, labelId) {
  try {
    if (!fileId || !labelId) {
      throw new Error("fileId and labelId are required.");
    }

    const request = {
      kind: "drive#modifyLabelsRequest",
      labelModifications: [
        {
          kind: "drive#labelModification",
          labelId: labelId,
          removeLabel: false
        }
      ]
    };

    const response = Drive.Files.modifyLabels(request, fileId);
    Logger.log(`Label ${labelId} applied to file ${fileId}: ${JSON.stringify(response.modifiedLabels)}`);
    return response.modifiedLabels || [];
  } catch (error) {
    Logger.log(`Error applying label ${labelId} to file ${fileId}: ${error.message}`);
    return [];
  }
}

// 4. Apply Label and Update Fields
function applyLabelAndUpdateFields(fileId, labelId, fields) {
  try {
    if (!fileId || !labelId || !fields || fields.length === 0) {
      throw new Error("fileId, labelId, and non-empty fields array are required.");
    }

    const fieldModifications = fields.map(field => {
      let fieldMod = {
        kind: "drive#labelFieldModification",
        fieldId: field.id
      };

      const value = field.value;
      if (!value) {
        Logger.log(`Skipping field ${field.id}: No value provided.`);
        return null;
      }

      switch (field.type) {
        case 'selection':
          fieldMod.setSelectionValues = [value];
          break;
        case 'integer':
          const intVal = parseInt(value);
          if (!isNaN(intVal)) {
            fieldMod.setIntegerValues = [intVal.toString()];
          } else {
            Logger.log(`Invalid integer for field ${field.id}: ${value}`);
            return null;
          }
          break;
        case 'date':
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            const isoDate = date.toISOString().split('T')[0];
            fieldMod.setDateValues = [isoDate];
          } else {
            Logger.log(`Invalid date for field ${field.id}: ${value}`);
            return null;
          }
          break;
        case 'text':
        default:
          fieldMod.setTextValues = [value];
          break;
      }

      return fieldMod;
    }).filter(mod => mod !== null);

    if (fieldModifications.length === 0) {
      Logger.log('No valid field modifications; applying label only.');
      return applyLabelToFile(fileId, labelId);
    }

    const request = {
      kind: "drive#modifyLabelsRequest",
      labelModifications: [
        {
          kind: "drive#labelModification",
          labelId: labelId,
          fieldModifications: fieldModifications,
          removeLabel: false
        }
      ]
    };

    const response = Drive.Files.modifyLabels(request, fileId);
    Logger.log(`Label ${labelId} and fields applied to file ${fileId}: ${JSON.stringify(response.modifiedLabels)}`);
    return response.modifiedLabels || [];
  } catch (error) {
    Logger.log(`Error applying label and fields to file ${fileId}: ${error.message}`);
    return [];
  }
}

// Full Label Automation: Chains all steps (mock suggestion/values for demo)
function fullLabelAutomation(fileId) {
  try {
    Logger.log(`Starting automation for file: ${fileId}`);

    // Step 1: Fetch labels
    const labelMap = fetchAvailableLabels();
    if (Object.keys(labelMap).length === 0) {
      Logger.log("No labels available. Exiting.");
      return;
    }

    // Step 2: Mock suggestion (replace with Gemini for dynamic AI)
    const suggestedLabel = "Invoice";  // Hardcoded for demo; integrate Gemini here
    const labelId = labelMap[suggestedLabel];
    if (!labelId) {
      Logger.log(`Suggested label "${suggestedLabel}" not found. Available: ${Object.keys(labelMap).join(", ")}. Exiting.`);
      return;
    }
    Logger.log(`Suggested and found label: ${suggestedLabel} (ID: ${labelId})`);

    // Step 3: Fetch fields
    const fieldMap = fetchLabelFields(labelId);
    if (Object.keys(fieldMap).length === 0) {
      Logger.log("No fields for label. Applying label only.");
      applyLabelToFile(fileId, labelId);
      return;
    }

    // Step 4: Build fields array with mock values (from your invoice doc; extract dynamically in prod)
    const fields = Object.keys(fieldMap).map(key => ({
      id: fieldMap[key].id,
      type: fieldMap[key].type,
      value: key === "Invoice Number" ? "100556" :
             key === "Invoice Date" ? "November 28, 2025" :
             key === "Vendor Name" ? "Spark Electrical Services" : "Default Value"
    }));

    // Apply label + fields
    applyLabelAndUpdateFields(fileId, labelId, fields);
    Logger.log("Automation complete! Check file labels in Drive.");
  } catch (error) {
    Logger.log(`Automation failed: ${error.message}`);
  }
}

function runDemo() {
  // Replace this with your actual File ID
  const myFileId = "your_file_id"; 
  
  fullLabelAutomation(myFileId);
}
