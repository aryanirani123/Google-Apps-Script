const fileId = "your_file_id";

function getUsers() {
  const file = DriveApp.getFileById(fileId);
  const editors = file.getEditors();
  const viewers = file.getViewers();
  
  const userEmails = [];
  
  // Extract emails from editors
  if (editors.length > 0) {
    editors.forEach(editor => {
      const email = editor.getEmail();
      if (email) {
        userEmails.push(email);
      }
    });
  }
  
  // Extract emails from viewers
  if (viewers.length > 0) {
    viewers.forEach(viewer => {
      const email = viewer.getEmail();
      if (email) {
        userEmails.push(email);
      }
    });
  }
  
  if (userEmails.length > 0) {
    Logger.log("Users with access:");
    userEmails.forEach(email => Logger.log(email));
  } else {
    Logger.log("No editors or viewers found for this file.");
  }
}
