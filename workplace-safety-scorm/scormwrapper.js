/**
 * SCORM 2004 4th Edition API Wrapper
 * Provides standardized interface for LMS communication
 * Falls back to localStorage when no LMS is available (standalone mode)
 */
var SCORMWrapper = (function() {
    var API = null;
    var initialized = false;
    var terminated = false;
    var standalone = false;
    var localData = {};
    var STORAGE_KEY = 'scorm_wrapper_data';

    function findAPI(win) {
        var attempts = 0;
        var maxAttempts = 10;

        while ((!win.API) && (win.parent) && (win.parent != win) && (attempts < maxAttempts)) {
            attempts++;
            win = win.parent;
        }

        return win.API;
    }

    function loadLocalData() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) localData = JSON.parse(raw);
        } catch (e) {
            localData = {};
        }
    }

    function saveLocalData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(localData));
        } catch (e) {}
    }

    function init() {
        if (initialized) return true;

        API = findAPI(window);

        if (!API) {
            console.warn("SCORM API not found. Running in standalone mode with localStorage fallback.");
            standalone = true;
            loadLocalData();
            initialized = true;
            terminated = false;
            return true;
        }

        var result = API.Initialize("");

        if (result === "true" || result === true) {
            initialized = true;
            terminated = false;
            console.log("SCORM 2004 initialized successfully");
            return true;
        } else {
            console.error("SCORM initialization failed:", API.GetDiagnostic ? API.GetDiagnostic("-1") : "Unknown error");
            return false;
        }
    }

    function commit() {
        if (!initialized || terminated) return false;
        if (standalone) {
            saveLocalData();
            return true;
        }
        return API.Commit("") === "true";
    }

    function terminate() {
        if (!initialized || terminated) return true;
        terminated = true;
        if (standalone) {
            saveLocalData();
            return true;
        }
        var result = API.Terminate("");
        return result === "true";
    }

    function get(param) {
        if (!initialized || terminated) return "";
        if (standalone) {
            return localData[param] || "";
        }
        return API.GetValue(param) || "";
    }

    function set(param, value) {
        if (!initialized || terminated) return false;
        if (standalone) {
            localData[param] = String(value);
            saveLocalData();
            return true;
        }
        return API.SetValue(param, String(value)) === "true";
    }

    function getLastError() {
        if (!API) return "";
        return API.GetLastError();
    }

    function getErrorString(errorCode) {
        if (!API) return "";
        return API.GetErrorString(errorCode);
    }

    function setCompletion(completed) {
        return set("cmi.completion_status", completed ? "completed" : "incomplete");
    }

    function setSuccess(passed) {
        return set("cmi.success_status", passed ? "passed" : "failed");
    }

    function setScore(score, min, max) {
        set("cmi.score.scaled", (score / max).toFixed(4));
        set("cmi.score.raw", score);
        set("cmi.score.min", min || 0);
        set("cmi.score.max", max || 100);
    }

    function setLocation(location) {
        return set("cmi.location", location);
    }

    function getLocation() {
        return get("cmi.location");
    }

    function suspend(data) {
        return set("cmi.suspend_data", JSON.stringify(data));
    }

    function getSuspend() {
        var data = get("cmi.suspend_data");
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    }

    function setInteraction(id, type, learnerResponse, result, correctResponse, description) {
        var idx = get("cmi.interactions._count") || 0;
        var prefix = "cmi.interactions." + idx + ".";

        set(prefix + "id", id);
        set(prefix + "type", type);
        set(prefix + "learner_response", String(learnerResponse));
        set(prefix + "result", result);

        if (correctResponse) {
            set(prefix + "correct_responses.0.pattern", String(correctResponse));
        }

        if (description) {
            set(prefix + "description", description);
        }

        return true;
    }

    return {
        init: init,
        commit: commit,
        terminate: terminate,
        get: get,
        set: set,
        getLastError: getLastError,
        getErrorString: getErrorString,
        setCompletion: setCompletion,
        setSuccess: setSuccess,
        setScore: setScore,
        setLocation: setLocation,
        getLocation: getLocation,
        suspend: suspend,
        getSuspend: getSuspend,
        setInteraction: setInteraction
    };
})();

// Data is saved explicitly via saveSuspendData() in scorm.js on every state change.
// Both beforeunload and visibilitychange handlers removed to prevent
// overwriting externally-modified localStorage data on page reload.

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
    module.exports = SCORMWrapper;
}
