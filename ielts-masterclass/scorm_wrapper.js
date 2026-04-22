/**
 * SCORM 2004 API Wrapper
 */
let scormAPI = null;
let initialized = false;

function findAPI(win) {
    let attempts = 0;
    while ((win.API_1484_11 == null) && (win.parent != null) && (win.parent != win)) {
        attempts++;
        if (attempts > 10) return null;
        win = win.parent;
    }
    return win.API_1484_11;
}

function initCourse() {
    scormAPI = findAPI(window);
    if (!scormAPI && window.opener) scormAPI = findAPI(window.opener);

    if (scormAPI) {
        if (scormAPI.Initialize("") === "true") {
            initialized = true;
            return true;
        }
    }
    return false;
}

function setCompletion() {
    if (initialized && scormAPI) {
        scormAPI.SetValue("cmi.completion_status", "completed");
        scormAPI.SetValue("cmi.success_status", "passed");
        scormAPI.Commit("");
    }
}
