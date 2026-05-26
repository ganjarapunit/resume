/**
 * SCORM 2004 4th Edition API Wrapper
 * Finds the LMS API, initializes the session, and handles completion tracking.
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
            console.log("SCORM 2004: Initialized successfully");
            return true;
        }
    }
    console.warn("SCORM 2004: API not found — running standalone");
    return false;
}

function setCompletion() {
    if (initialized && scormAPI) {
        scormAPI.SetValue("cmi.completion_status", "completed");
        scormAPI.SetValue("cmi.success_status", "passed");
        scormAPI.Commit("");
        console.log("SCORM 2004: Completion saved");
    }
}

function setFailed() {
    if (initialized && scormAPI) {
        scormAPI.SetValue("cmi.completion_status", "completed");
        scormAPI.SetValue("cmi.success_status", "failed");
        scormAPI.SetValue("cmi.score.scaled", "0");
        scormAPI.Commit("");
        console.log("SCORM 2004: Failed status saved");
    }
}

function setScore(raw, min, max) {
    if (initialized && scormAPI) {
        scormAPI.SetValue("cmi.score.raw", String(raw));
        scormAPI.SetValue("cmi.score.min", String(min));
        scormAPI.SetValue("cmi.score.max", String(max));
        if (max > min) {
            const scaled = (raw - min) / (max - min);
            scormAPI.SetValue("cmi.score.scaled", scaled.toFixed(4));
        }
        scormAPI.Commit("");
    }
}

function commitData() {
    if (initialized && scormAPI) {
        scormAPI.Commit("");
    }
}

function finishCourse() {
    if (initialized && scormAPI) {
        scormAPI.Terminate("");
        initialized = false;
    }
}

// Auto-initialize on page load
window.addEventListener("load", initCourse);
