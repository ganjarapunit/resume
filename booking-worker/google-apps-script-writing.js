/**
 * Google Apps Script for EFL Writing Submissions
 * Owner: ganjarapunit@gmail.com
 * 
 * 1. Create a new Google Sheet: https://sheets.google.com -> Blank -> Name "EFL Writing Submissions"
 * 2. Extensions -> Apps Script -> Delete Code.gs content -> Paste this entire file
 * 3. Publish: Deploy -> New deployment -> Type: Web app
 *    - Description: "EFL Submissions"
 *    - Execute as: Me (ganjarapunit@gmail.com)
 *    - Who has access: Anyone (or Anyone with link) - needed for booking-worker to POST without auth
 *    - Copy the Web App URL (https://script.google.com/macros/s/XXXXX/exec)
 * 4. In Cloudflare Worker: wrangler secret put GOOGLE_SHEET_WEBHOOK_URL -> paste the Web App URL
 * 5. Test: Submit a writing in any lesson -> check Sheet row appears + email to ganjarapunit@gmail.com
 * 
 * What this does:
 * - Appends every writing submission as a row in sheet "Submissions"
 * - Auto-creates/updates a Google Doc per learner in folder "EFL Learner Docs" for easy feedback
 * - Headers: Timestamp | Name | Email | Lesson | Lesson Title | Activity ID | Activity Title | Type | Text | URL
 */

const SHEET_NAME = 'Submissions';
const DOC_FOLDER_NAME = 'EFL Learner Docs';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    // Support batch submissions
    const items = Array.isArray(data.submissions) ? data.submissions : [data];
    const sheet = getOrCreateSheet();
    const docs = [];
    
    items.forEach(item => {
      const row = [
        item.timestamp || new Date().toISOString(),
        item.name || 'Guest',
        item.email || '',
        item.lesson || '',
        item.lessonTitle || '',
        item.activityId || '',
        item.activityTitle || '',
        item.activityType || 'writing',
        item.text || '',
        item.url || ''
      ];
      sheet.appendRow(row);
      
      // Also update per-learner Doc
      try {
        const docUrl = appendToLearnerDoc(item);
        docs.push(docUrl);
      } catch (err) {
        console.error('Doc append failed', err);
      }
    });
    
    return ContentService.createTextOutput(JSON.stringify({ ok: true, docs: docs }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, message: 'EFL Writing Webhook is live. POST writing submissions here.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Lesson', 'Lesson Title', 'Activity ID', 'Activity Title', 'Type', 'Text', 'URL']);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#0b3d91').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    // Auto-resize and set column widths
    sheet.setColumnWidth(1, 180); // Timestamp
    sheet.setColumnWidth(2, 140); // Name
    sheet.setColumnWidth(3, 180); // Email
    sheet.setColumnWidth(4, 250); // Lesson
    sheet.setColumnWidth(5, 200); // Lesson Title
    sheet.setColumnWidth(6, 120); // Activity ID
    sheet.setColumnWidth(7, 200); // Activity Title
    sheet.setColumnWidth(8, 90);  // Type
    sheet.setColumnWidth(9, 500); // Text
    sheet.setColumnWidth(10, 250); // URL
    sheet.getRange(1, 1, 1, 10).setWrap(true);
  }
  return sheet;
}

function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(DOC_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(DOC_FOLDER_NAME);
}

function appendToLearnerDoc(item) {
  const name = (item.name || 'Guest').trim() || 'Guest';
  const safeName = name.replace(/[\\/*?:"<>|]/g, '').substring(0, 50);
  const folder = getOrCreateFolder();
  const docName = safeName + ' — EFL Writing';
  
  let doc;
  const files = folder.getFilesByName(docName);
  if (files.hasNext()) {
    const file = files.next();
    doc = DocumentApp.openById(file.getId());
  } else {
    doc = DocumentApp.create(docName);
    const file = DriveApp.getFileById(doc.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
    // Add header
    const body = doc.getBody();
    body.appendParagraph('EFL Writing — ' + safeName)
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph('All writing submissions for ' + safeName + '. Give feedback via comments or suggest edits.')
      .setHeading(DocumentApp.ParagraphHeading.NORMAL);
    body.appendParagraph('Created: ' + new Date().toLocaleString())
      .setHeading(DocumentApp.ParagraphHeading.NORMAL);
    doc.saveAndClose();
    doc = DocumentApp.openById(doc.getId());
  }
  
  const body = doc.getBody();
  body.appendParagraph(''); // spacer
  const titlePara = body.appendParagraph(
    (item.lessonTitle || item.lesson) + ' — ' + (item.activityTitle || item.activityId)
  );
  titlePara.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  
  const meta = 'Time: ' + (item.timestamp || new Date().toISOString()) + ' | Activity: ' + (item.activityId || '') + ' | Type: ' + (item.activityType || 'writing');
  body.appendParagraph(meta).setAttributes({
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#5b6678',
    [DocumentApp.Attribute.FONT_SIZE]: 8,
    [DocumentApp.Attribute.ITALIC]: true
  });
  
  const textPara = body.appendParagraph(item.text || '');
  textPara.setAttributes({
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#07142b',
    [DocumentApp.Attribute.FONT_SIZE]: 11
  });
  // Add a comment placeholder for teacher feedback
  body.appendParagraph('Feedback: ').setAttributes({
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#0b3d91',
    [DocumentApp.Attribute.BOLD]: true
  });
  body.appendHorizontalRule();
  
  doc.saveAndClose();
  return doc.getUrl();
}

// Test function - run this manually in Apps Script editor to verify Sheet/Doc creation
function testSubmission() {
  const mock = {
    timestamp: new Date().toISOString(),
    name: 'Test Learner',
    email: 'test@example.com',
    lesson: '/teacher/efl-activities/b2/exam-english/Annisa-Day03-Choose-Data-Learner.html',
    lessonTitle: 'Day 3 Choose Data - Test',
    activityId: 'act7',
    activityTitle: 'We write',
    activityType: 'writing',
    text: 'Overall, internet use rose dramatically while broadcast declined.',
    url: 'https://punitganjara.com/teacher/efl-activities/b2/exam-english/Annisa-Day03-Choose-Data-Learner.html'
  };
  const sheet = getOrCreateSheet();
  sheet.appendRow([mock.timestamp, mock.name, mock.email, mock.lesson, mock.lessonTitle, mock.activityId, mock.activityTitle, mock.activityType, mock.text, mock.url]);
  const docUrl = appendToLearnerDoc(mock);
  Logger.log('Test row appended. Doc: ' + docUrl);
}
