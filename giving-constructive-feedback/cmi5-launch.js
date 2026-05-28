const CMI5 = (function() {
    const params = new URLSearchParams(window.location.search);

    // ── LRS config: prefer cmi5 launch params, fall back to Veracity LRS ──
    const LRS_ENDPOINT = params.get("endpoint") || "https://portfolio-testing.lrs.io/xapi/statements";
    const LRS_AUTH = params.get("auth") || "Basic ZTY0Mzc3NzAtMzEzMC00NTE0LThiNDMtNTIyNDY0NzM3ZjI5OjRhYmVmYTc4LTE2M2UtNGI3Ni1iNzY3LWM0YWRhYWFhODgzZg==";
    const ACTIVITY_ID = params.get("activityId") || "https://ganjarapunit.github.io/resume/giving-constructive-feedback/";
    const REGISTRATION = params.get("registration") || crypto.randomUUID();

    function generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 3 | 8);
            return v.toString(16);
        });
    }

    function getVisitorId() {
        var id = localStorage.getItem('cmi5_visitor_id');
        if (!id) { id = generateId(); localStorage.setItem('cmi5_visitor_id', id); }
        return id;
    }

    function getActor() {
        if (params.get("actor")) {
            try {
                var a = JSON.parse(decodeURIComponent(params.get("actor")));
                return { objectType: "Agent", mbox: a.mbox, account: a.account, name: a.name };
            } catch (e) {}
        }
        return {
            objectType: "Agent",
            account: { homePage: "https://ganjarapunit.github.io/resume", name: getVisitorId() },
            name: "Learner-" + getVisitorId().slice(0, 8)
        };
    }

    function sendStatement(verb, result, contextExtras) {
        var statement = {
            actor: getActor(),
            verb: verb,
            object: {
                objectType: "Activity",
                id: ACTIVITY_ID,
                definition: {
                    name: { "en-US": "Giving Constructive Feedback" },
                    description: { "en-US": "A microlearning module on delivering effective feedback in the workplace." }
                }
            },
            context: {
                registration: REGISTRATION,
                contextActivities: {
                    category: [{
                        id: "http://www.adlnet.gov/expapi/activities/profile",
                        definition: { type: "http://adlnet.gov/expapi/activities/cmi5" }
                    }]
                }
            },
            timestamp: new Date().toISOString()
        };
        if (result) statement.result = result;
        if (contextExtras) Object.assign(statement.context, contextExtras);

        try {
            fetch(LRS_ENDPOINT, {
                method: "POST",
                headers: {
                    "Authorization": LRS_AUTH,
                    "Content-Type": "application/json",
                    "X-Experience-API-Version": "1.0.3"
                },
                body: JSON.stringify(statement)
            }).catch(function() {});
        } catch (e) {}
    }

    return {
        initialized: false,

        initialize: function() {
            if (this.initialized) return;
            this.initialized = true;
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/initialized",
                display: { "en-US": "initialized" }
            });
        },

        complete: function(success) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: { "en-US": "completed" }
            }, { completion: true, success: success !== false });
        },

        pass: function(score) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/passed",
                display: { "en-US": "passed" }
            }, { completion: true, success: true, score: score || { scaled: 1 } });
        },

        fail: function(score) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/failed",
                display: { "en-US": "failed" }
            }, { completion: true, success: false, score: score || { scaled: 0 } });
        },

        terminate: function() {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/terminated",
                display: { "en-US": "terminated" }
            });
        },

        progressed: function(pct) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/progressed",
                display: { "en-US": "progressed" }
            }, { extensions: { "https://w3id.org/xapi/cmi5/result/extensions/progress": pct } });
        },

        interacted: function(action, details) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/interacted",
                display: { "en-US": "interacted" }
            }, null, {
                extensions: {
                    "https://ganjarapunit.github.io/resume/ext/action": action,
                    "https://ganjarapunit.github.io/resume/ext/details": details
                }
            });
        },

        answered: function(questionId, correct) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/answered",
                display: { "en-US": "answered" }
            }, { response: questionId, success: correct, completion: true });
        }
    };
})();

document.addEventListener("DOMContentLoaded", function() {
    CMI5.initialize();
});

window.addEventListener("beforeunload", function() {
    CMI5.terminate();
});
