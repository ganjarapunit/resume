// Google Apps Script for Needs Analysis -> Google Sheet
// 1. Create a new Google Sheet (e.g. "Needs Analysis Responses")
// 2. Extensions -> Apps Script -> paste this file
// 3. Deploy -> New deployment -> Web app -> Execute as: Me, Who has access: Anyone
// 4. Copy the Web App URL and set it as a secret in the worker:
//      wrangler secret put GOOGLE_SHEET_WEBHOOK_URL
//    Paste the URL when prompted.

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Name', 'Native Language', 'Where Use English', 'Main Goal', 'Timeline',
        'Speaking', 'Listening', 'Reading', 'Writing', 'Grammar',
        'Biggest Fear', 'Study Preferences', 'Feedback Pref', 'Topics',
        'Contact Email', 'Phone', 'Contact Pref', 'Submitted At'
      ]);
      sheet.getRange(1, 1, 1, 18).setFontWeight('bold').setBackground('#0b3d91').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    var ratings = data.ratings || {};
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.nativeLanguage || '',
      (data.useEnglish || []).join(', '),
      data.mainGoal || '',
      data.timeline || '',
      ratings.speaking || '',
      ratings.listening || '',
      ratings.reading || '',
      ratings.writing || '',
      ratings.grammar || '',
      data.fear || '',
      (data.studyPref || []).join(', '),
      data.feedback || '',
      (data.topics || []).join(', '),
      data.contactEmail || '',
      data.phone || '',
      data.contactPref || '',
      data.submittedAt || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, message: 'Needs Analysis webhook is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
